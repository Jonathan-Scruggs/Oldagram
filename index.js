import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase, ref, push, onValue,remove, child, get, update} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://oldagram-v2-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const postsInDB = ref(database)
const main = document.getElementsByTagName("main")[0]

function renderPost(postID, post){
    let newPost = document.createElement("section")
    main.append(newPost)


    let postContainer = document.createElement("div")
    postContainer.classList.add("container", "post") // Adding the necessary classes for the div
    newPost.appendChild(postContainer)

    // Post Header
    let postHeader = document.createElement("div")
    postHeader.classList.add("post-header")
    postContainer.appendChild(postHeader)


    // Poster Pfp
    let posterPFP = document.createElement("img")
    posterPFP.classList.add("poster-pfp")
    posterPFP.src = post.avatar
    postHeader.append(posterPFP)

    // User Name and location
    let postInfo = document.createElement("div")
    postInfo.classList.add("poster-info")
    postHeader.append(postInfo)

    let username = document.createElement("span")
    username.textContent = post.name
    username.classList.add("username")
    postInfo.appendChild(username)

    let location = document.createElement("span")
    location.textContent = post.location
    location.classList.add("location")
    postInfo.appendChild(location)


    // Post Image
    let postImage = document.createElement("img")
    postImage.classList.add("post-image")
    postImage.src = post.post
    postContainer.appendChild(postImage)

    // Icon Container
    let iconContainer = document.createElement("div")
    iconContainer.classList.add("icon-container")
    postContainer.appendChild(iconContainer)
    // Icons
    let heartIcon = document.createElement("img")
    heartIcon.src = "images/icon-heart.png" 
    heartIcon.classList.add("icon")
    
    let commentIcon = document.createElement("img")
    commentIcon.src = "images/icon-comment.png"
    commentIcon.classList.add("icon")

    let shareIcon = document.createElement("img")
    shareIcon.src = "images/icon-dm.png"
    shareIcon.classList.add("icon")

    iconContainer.append(heartIcon,commentIcon,shareIcon)




    let postInteractions = document.createElement("div");
    postInteractions.classList.add("post-interactions");
    postContainer.append(postInteractions);

    let likes = document.createElement("span");
    likes.textContent = post.likes + " likes";
    likes.classList.add("likes", "bold");
    postInteractions.appendChild(likes);

    let postDescription = document.createElement("div");
    postDescription.classList.add("post-description")
    postInteractions.appendChild(postDescription)

    let profileName = document.createElement("span")
    profileName.classList.add("bold")
    profileName.textContent = post.username

    let comment = document.createElement("span")
    comment.textContent = " " + post.comment

    postDescription.append(profileName,comment)

    likeEventListener(postID,post,heartIcon)
}
async function fetchAndRenderPosts(){
    console.log("rendering")
    main.innerHTML = " "
    try {
        const snapshot = await get(postsInDB)
        if(snapshot.exists()){
            const posts = Object.entries(snapshot.val())
            for (let i =0; i < posts.length; i++){
                let postID = posts[i][0]
                let postValues = posts[i][1]
                renderPost(postID,postValues)
            }

        }
    } catch(error){
        console.log("Error fetch data ", error)
    }
}


function likeEventListener(postID,post,heartIcon){
    heartIcon.addEventListener("click",function(){
        updateLikes(postID,post,heartIcon)
    })
}

async function updateLikes(postID,post,heartIcon){
    let postRef = child(postsInDB,postID)
    try {
        const snapshot = await get(postRef)
        if (snapshot.exists()){
            post = snapshot.val()
            let newLikes = post.likes + 1
            await update(postRef,{likes:newLikes})
        }
    }
    catch(error){
        console.log("Unable to update likes", error)
    }

}

onValue (postsInDB,function(snapshot){
    fetchAndRenderPosts()
})




