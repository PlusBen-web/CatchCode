// Page fade-in animation
document.body.classList.add("fade");

// Practice live preview
const codeArea = document.getElementById("code");
const preview = document.getElementById("preview");
if (codeArea && preview) {
  codeArea.addEventListener("input", () => {
    preview.srcdoc = codeArea.value;
  });
}

// Profile edit
const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");
const editProfile = document.querySelector(".edit-profile");
const profileCard = document.querySelector(".profile-card");

if (editBtn) {
  editBtn.onclick = () => {
    editProfile.classList.remove("hidden");
    profileCard.classList.add("hidden");
  };
}
if (saveBtn) {
  saveBtn.onclick = () => {
    const name = document.getElementById("name-input").value;
    const bio = document.getElementById("bio-input").value;
    document.querySelector(".username").innerText = name || "No name";
    document.querySelector(".bio").innerText = bio || "No bio added.";
    editProfile.classList.add("hidden");
    profileCard.classList.remove("hidden");
  };
}
