const postsContainer = document.getElementById("postsContainer");
const createPostForm = document.getElementById("createPostForm");
const linkButton = document.querySelector(".load-button");
const deletePostButton = document.querySelector(".deletePostButton");
const editPostButton = document.querySelector(".editPostButton");

let posts = [];
let currentIndex = 0;
let postId = null;

async function fetchPosts() {
    try {
        const response = await fetch("https://687cb0eb918b6422432f194e.mockapi.io/posts");
        posts = await response.json();
    } catch (error) {
        console.log(error);
    }
}

function renderCurrentPost() {
    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>Постів немає</p>";
        return;
    }
    const post = posts[currentIndex];
    postsContainer.innerHTML = `
        <div class="post" data-id="${post.id}">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
        </div>
    `;
}

async function updatePost(id, title, content) {
  try {
    const response = await fetch(
      `https://687cb0eb918b6422432f194e.mockapi.io/posts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      }
    );
    const updatedPost = await response.json();

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

editPostButton.addEventListener("click", () => {
    if (posts.length === 0) return;
    const post = posts[currentIndex];

    document.getElementById("titleInput").value = post.title;
    document.getElementById("contentInput").value = post.content;
    postId = post.id;
});

linkButton.addEventListener("click", () => {
    if (posts.length === 0) return;
    if (currentIndex < posts.length - 1) {
        currentIndex++;
        renderCurrentPost();
    } else {
        alert("останній пост");
    }
});

deletePostButton.addEventListener("click", async () => {
    if (posts.length === 0) return;

    const post = posts[currentIndex];
    try {
        const response = await fetch(`https://687cb0eb918b6422432f194e.mockapi.io/posts/${post.id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            posts.splice(currentIndex, 1);
            if (currentIndex > 0) {
                currentIndex--;
            }
            renderCurrentPost();
        }
    } catch (error) {
        console.log(error);
    }
});

createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("titleInput").value.trim();
    const content = document.getElementById("contentInput").value.trim();
        if (createPostForm.dataset.mode === "edit") {
            const updatedPost = await updatePost(posts[currentIndex].id, title, content);
            posts[currentIndex] = updatedPost;
        } else {
            const response = await fetch("https://687cb0eb918b6422432f194e.mockapi.io/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            const newPost = await response.json();
            posts.push(newPost);
            currentIndex = posts.length - 1;
        }
        renderCurrentPost();
        createPostForm.reset();
});

async function startApp() {
    await fetchPosts();
    renderCurrentPost();
};
