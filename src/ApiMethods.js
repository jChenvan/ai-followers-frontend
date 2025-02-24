const url = "https://ai-followers-backend-production.up.railway.app";
const headers = () => ({
  "Content-Type": "application/json",
  Authorization: localStorage.token,
});

async function handleRedirect(nav,fetcher) {
  try {
    const res = await fetcher();
    if (!res.ok) {
      if (res.status == 403) nav("/ai-followers-frontend/login", { replace: true });
      throw new Error(`Error:${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

function ApiMethods(nav) {
  return {
    Post: {
      get: async () =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/posts/`, { method: "GET", headers:headers() }),
        ),
      add: async (content, parentId, charId) =>
        await handleRedirect(nav,
          async () =>
            await fetch(`${url}/posts/`, {
              method: "POST",
              body: JSON.stringify({
                content,
                parentId,
                charId,
              }),
              headers:headers(),
            }),
        ),
      remove: async (postId) =>
        await handleRedirect(nav,
          async () =>
            await fetch(`${url}/posts/${postId}`, {
              method: "DELETE",
              headers:headers(),
            }),
        ),
    },
    Message: {
      get: async (charId) =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/messages/${charId}`, {
            method: "GET",
            headers:headers(),
          }),
        ),
      add: async (recipientId, content, charId) =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/messages/`, {
            method: "POST",
            body: JSON.stringify({
              recipientId,
              content,
              charId,
            }),
            headers:headers(),
          }),
        ),
      remove: async (messageId) =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/messages/${messageId}`, {
            method: "DELETE",
            headers:headers(),
          }),
        ),
    },
    Friend: {
      get: async () =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/characters/`, {
            method: "GET",
            headers:headers(),
          }),
        ),
      add: async (username, prompt) =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/characters/`, {
            method: "POST",
            body: JSON.stringify({
              username,
              prompt,
            }),
            headers:headers(),
          }),
        ),
      remove: async (userId) =>
        await handleRedirect(nav,
          async () => await fetch(`${url}/characters/${userId}`, {
            method: "DELETE",
            headers:headers(),
          }),
        ),
    },
  };
}

export default ApiMethods;
