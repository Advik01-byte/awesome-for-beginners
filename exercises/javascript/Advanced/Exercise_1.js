// Fetch JSON but missing await and mixing .then
async function fetchData() {
  const r = fetch('https://jsonplaceholder.typicode.com/todos/1');
  const data = r.json();
  console.log(data.title);
}
fetchData();
