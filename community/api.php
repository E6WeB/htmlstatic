<?php
declare(strict_types=1);
require_once __DIR__ . '/lib.php';
header('Access-Control-Allow-Credentials: true');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [app_base_url()]; if (getenv('FRONTEND_ORIGIN')) $allowed[] = rtrim((string)getenv('FRONTEND_ORIGIN'), '/');
if ($origin && in_array(rtrim($origin, '/'), $allowed, true)) { header('Access-Control-Allow-Origin: ' . $origin); header('Vary: Origin'); }
header('Access-Control-Allow-Headers: Content-Type'); header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }
$action = $_GET['action'] ?? 'bootstrap';
try { ensure_schema(); } catch (Throwable $e) { error_log('StaticStack DB init: ' . $e->getMessage()); json_response(['error'=>'Database is not ready. Check Wasmer PostgreSQL settings and run sql/schema.sql if needed.'], 503); }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') require_same_origin();
$user = current_user();
if ($action === 'bootstrap') {
  $cats = db()->query('SELECT id, slug, name, description FROM forum_categories ORDER BY name')->fetchAll();
  json_response(['user'=>$user ? ['login'=>$user['login'],'name'=>$user['name'],'avatar'=>$user['avatar'],'admin'=>!empty($user['admin'])] : null,'categories'=>$cats]);
}
if ($action === 'categories') json_response(['categories'=>db()->query('SELECT id,slug,name,description FROM forum_categories ORDER BY name')->fetchAll()]);
if ($action === 'topics') {
  $where = ['t.is_hidden = FALSE']; $params = [];
  if (!empty($_GET['category'])) { $where[] = 'c.slug = :category'; $params[':category'] = substr((string)$_GET['category'],0,80); }
  if (!empty($_GET['q'])) { $where[] = '(t.title ILIKE :q1 OR t.body ILIKE :q2 OR u.login ILIKE :q3)'; $needle = '%' . substr((string)$_GET['q'],0,100) . '%'; $params[':q1'] = $needle; $params[':q2'] = $needle; $params[':q3'] = $needle; }
  $sql = 'SELECT t.id,t.title,t.body,t.created_at,t.updated_at,c.slug AS category_slug,c.name AS category_name,u.login,u.display_name,u.avatar_url, (SELECT COUNT(*) FROM forum_replies r WHERE r.topic_id=t.id AND r.is_hidden=FALSE) AS reply_count, (SELECT COALESCE(SUM(v.value),0) FROM forum_votes v WHERE v.topic_id=t.id) AS score, (SELECT v.value FROM forum_votes v WHERE v.topic_id=t.id AND v.user_id=:voter LIMIT 1) AS my_vote FROM forum_topics t JOIN forum_categories c ON c.id=t.category_id JOIN forum_users u ON u.id=t.user_id WHERE ' . implode(' AND ',$where) . ' ORDER BY t.updated_at DESC LIMIT 100';
  $params[':voter'] = $user['uid'] ?? 0; $st = db()->prepare($sql); $st->execute($params); json_response(['topics'=>$st->fetchAll()]);
}
if ($action === 'topic') {
  $id = filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT); if (!$id) json_response(['error'=>'A valid topic ID is required.'],400);
  $st = db()->prepare('SELECT t.id,t.title,t.body,t.created_at,t.updated_at,t.is_hidden,c.slug AS category_slug,c.name AS category_name,u.login,u.display_name,u.avatar_url,u.id AS author_id,(SELECT COALESCE(SUM(v.value),0) FROM forum_votes v WHERE v.topic_id=t.id) AS score,(SELECT v.value FROM forum_votes v WHERE v.topic_id=t.id AND v.user_id=:voter LIMIT 1) AS my_vote FROM forum_topics t JOIN forum_categories c ON c.id=t.category_id JOIN forum_users u ON u.id=t.user_id WHERE t.id=:id'); $st->execute([':id'=>$id,':voter'=>$user['uid'] ?? 0]); $topic=$st->fetch(); if (!$topic || ($topic['is_hidden'] && empty($user['admin']))) json_response(['error'=>'Topic not found.'],404);
  $st = db()->prepare('SELECT r.id,r.body,r.created_at,r.is_hidden,u.login,u.display_name,u.avatar_url,u.id AS author_id,(SELECT COALESCE(SUM(v.value),0) FROM forum_votes v WHERE v.reply_id=r.id) AS score,(SELECT v.value FROM forum_votes v WHERE v.reply_id=r.id AND v.user_id=:voter LIMIT 1) AS my_vote FROM forum_replies r JOIN forum_users u ON u.id=r.user_id WHERE r.topic_id=:id AND (r.is_hidden=FALSE OR :admin=TRUE) ORDER BY r.created_at ASC'); $st->execute([':id'=>$id,':voter'=>$user['uid'] ?? 0,':admin'=>!empty($user['admin']) ? 'true' : 'false']); json_response(['topic'=>$topic,'replies'=>$st->fetchAll()]);
}
if ($action === 'create_topic') {
  $u=require_user(); $d=read_json(); $title=trim((string)($d['title']??'')); $body=trim((string)($d['body']??'')); $slug=trim((string)($d['category']??''));
  if (text_length($title)<5 || text_length($title)>180) json_response(['error'=>'Title must be between 5 and 180 characters.'],400);
  if (text_length($body)<10 || text_length($body)>20000) json_response(['error'=>'Post must be between 10 and 20,000 characters.'],400);
  $st=db()->prepare('SELECT id FROM forum_categories WHERE slug=:slug'); $st->execute([':slug'=>$slug]); $cat=$st->fetchColumn(); if (!$cat) json_response(['error'=>'Choose a valid category.'],400);
  $st=db()->prepare('INSERT INTO forum_topics (category_id,user_id,title,body) VALUES (:cat,:uid,:title,:body) RETURNING id'); $st->execute([':cat'=>$cat,':uid'=>$u['uid'],':title'=>$title,':body'=>$body]); json_response(['ok'=>true,'id'=>(int)$st->fetchColumn()],201);
}
if ($action === 'reply') {
  $u=require_user(); $d=read_json(); $id=(int)($d['topic_id']??0); $body=trim((string)($d['body']??'')); if ($id<1 || text_length($body)<2 || text_length($body)>10000) json_response(['error'=>'Reply must be between 2 and 10,000 characters.'],400);
  $st=db()->prepare('SELECT id FROM forum_topics WHERE id=:id AND is_hidden=FALSE'); $st->execute([':id'=>$id]); if (!$st->fetchColumn()) json_response(['error'=>'Topic not found.'],404);
  $st=db()->prepare('INSERT INTO forum_replies (topic_id,user_id,body) VALUES (:topic,:uid,:body) RETURNING id'); $st->execute([':topic'=>$id,':uid'=>$u['uid'],':body'=>$body]); db()->prepare('UPDATE forum_topics SET updated_at=NOW() WHERE id=:id')->execute([':id'=>$id]); json_response(['ok'=>true,'id'=>(int)$st->fetchColumn()],201);
}
if ($action === 'vote') {
  $u=require_user(); $d=read_json(); $kind=($d['kind']??'')==='reply'?'reply':'topic'; $target=(int)($d['id']??0); $value=(int)($d['value']??0); if ($target<1 || !in_array($value,[-1,1],true)) json_response(['error'=>'Invalid vote.'],400);
  $table=$kind==='reply'?'forum_replies':'forum_topics'; $field=$kind==='reply'?'reply_id':'topic_id'; $st=db()->prepare("SELECT id FROM {$table} WHERE id=:id AND is_hidden=FALSE"); $st->execute([':id'=>$target]); if (!$st->fetchColumn()) json_response(['error'=>'Content not found.'],404);
  $pdo=db(); $pdo->beginTransaction(); try { $st=$pdo->prepare("SELECT id,value FROM forum_votes WHERE user_id=:uid AND {$field}=:target FOR UPDATE"); $st->execute([':uid'=>$u['uid'],':target'=>$target]); $old=$st->fetch(); if ($old && (int)$old['value']===$value) { $pdo->prepare('DELETE FROM forum_votes WHERE id=:id')->execute([':id'=>$old['id']]); $new=0; } elseif ($old) { $pdo->prepare('UPDATE forum_votes SET value=:value,created_at=NOW() WHERE id=:id')->execute([':value'=>$value,':id'=>$old['id']]); $new=$value; } else { $pdo->prepare("INSERT INTO forum_votes (user_id,{$field},value) VALUES (:uid,:target,:value)")->execute([':uid'=>$u['uid'],':target'=>$target,':value'=>$value]); $new=$value; } $pdo->commit(); } catch(Throwable $e) { $pdo->rollBack(); throw $e; }
  json_response(['ok'=>true,'my_vote'=>$new]);
}
if ($action === 'report') {
  $u=require_user(); $d=read_json(); $kind=($d['kind']??'')==='reply'?'reply':'topic'; $id=(int)($d['id']??0); $reason=trim((string)($d['reason']??'')); if ($id<1 || text_length($reason)<5 || text_length($reason)>500) json_response(['error'=>'Please provide a reason between 5 and 500 characters.'],400);
  $field=$kind==='reply'?'reply_id':'topic_id'; $table=$kind==='reply'?'forum_replies':'forum_topics'; $st=db()->prepare("SELECT id FROM {$table} WHERE id=:id"); $st->execute([':id'=>$id]); if (!$st->fetchColumn()) json_response(['error'=>'Content not found.'],404);
  $st=db()->prepare("INSERT INTO forum_reports (reporter_id,{$field},reason) VALUES (:uid,:id,:reason) RETURNING id"); $st->execute([':uid'=>$u['uid'],':id'=>$id,':reason'=>$reason]); json_response(['ok'=>true,'id'=>(int)$st->fetchColumn()],201);
}
if ($action === 'admin_reports') {
  require_admin(); $st=db()->query("SELECT rp.id,rp.reason,rp.status,rp.created_at,reporter.login AS reporter_login, t.id AS topic_id,t.title AS topic_title, r.id AS reply_id,r.body AS reply_body FROM forum_reports rp JOIN forum_users reporter ON reporter.id=rp.reporter_id LEFT JOIN forum_topics t ON t.id=rp.topic_id LEFT JOIN forum_replies r ON r.id=rp.reply_id WHERE rp.status='pending' ORDER BY rp.created_at ASC LIMIT 200"); json_response(['reports'=>$st->fetchAll()]);
}
if ($action === 'moderate') {
  $u=require_admin(); $d=read_json(); $kind=($d['kind']??'')==='reply'?'reply':'topic'; $id=(int)($d['id']??0); $hidden=filter_var($d['hidden']??false,FILTER_VALIDATE_BOOLEAN); if ($id<1) json_response(['error'=>'Invalid content ID.'],400); $table=$kind==='reply'?'forum_replies':'forum_topics'; $st=db()->prepare("UPDATE {$table} SET is_hidden=:hidden,updated_at=NOW() WHERE id=:id"); $st->execute([':hidden'=>$hidden?'true':'false',':id'=>$id]); json_response(['ok'=>true]);
}
if ($action === 'review_report') {
  $u=require_admin(); $d=read_json(); $id=(int)($d['id']??0); $status=($d['status']??'')==='dismissed'?'dismissed':'resolved'; if ($id<1) json_response(['error'=>'Invalid report ID.'],400); $st=db()->prepare('UPDATE forum_reports SET status=:status,reviewed_by=:uid,reviewed_at=NOW() WHERE id=:id'); $st->execute([':status'=>$status,':uid'=>$u['uid'],':id'=>$id]); json_response(['ok'=>true]);
}
json_response(['error'=>'Unknown action.'],404);
