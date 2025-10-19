export async function GET() {
  const html = `<!doctype html><meta charset="utf-8">
<script>
try {
  localStorage.setItem('entitlement:theme:onepiece1','1');
  localStorage.setItem('visual-theme','onepiece1');
  location.replace('/preview/home-full');
} catch (e) {
  document.body.textContent = 'Enable failed: ' + e;
}
</script>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
