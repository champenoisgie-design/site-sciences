export async function GET() {
  const html = `<!doctype html><meta charset="utf-8">
<script>
try {
  localStorage.removeItem('entitlement:theme:onepiece1');
  localStorage.setItem('visual-theme','base');
  location.replace('/preview/home-full');
} catch (e) {
  document.body.textContent = 'Disable failed: ' + e;
}
</script>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
