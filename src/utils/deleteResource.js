export default function deleteResource({ id, resourceType }) {
  return fetch(`http://localhost:5000/api/${resourceType}/${id}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => Promise.resolve(true))
    .catch((e) => {
      return Promise.reject(false);
    });
}
