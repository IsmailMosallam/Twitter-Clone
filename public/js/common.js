// post and reply 
$("#postTextarea , #replyTextarea").keyup(function(event) {

    // var textBox = $(event.target);
    var value = $(this).val().trim();
    var isModal = $(this).parents(".modal").length === 1;
    var submitButton = isModal ? $("#buttonreply") : $("#postButton")
    if (submitButton.length === 0) {
        alert("No submit button found");
    }
    if (value === "") {
        submitButton.prop("disabled", true)
        return
    }
    submitButton.prop("disabled", false)
    return


});

$(document).on('click', '.likeButton', function() {
    var button = $(this);
    var postId = getPostIdFromElement(button)
    if (postId === undefined) {
        return console.log("error")
    }
    $.ajax({
        type: "put",
        url: `/api/posts/${postId}/like`,
        success: function(response) {
            button.find("span").text(response.likes.length || "")
            if (response.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else
                button.removeClass("active")

        }
    });


})

$(document).on('click', '.retweetButton', function() {
    var button = $(this);
    var postId = getPostIdFromElement(button)
    if (postId === undefined) {
        return console.log("error")
    }
    $.ajax({
        type: "post",
        url: `/api/posts/${postId}/retweet`,
        success: function(response) {

            console.log(response)
        }

    });


})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot == true ? element : element.closest(".post");

    var postId = rootElement.data().id;

    if (postId === undefined) return alert("Post id undefined");

    return postId;
}

$('#postButton').click(function() {
    const button = $(this);
    var postText = $("#postTextarea");
    var data = {
        content: postText.val()
    }
    $.post("/api/posts", data, sendData => {
        var html = createPostHtml(sendData)
        $(".createPosthtml").prepend(html);
        postText.val('');
        button.prop('disabled', true)
        console.log(sendData)


    })
});

function createPostHtml(postData) {

    var postedBy = postData.postBy;
    const name = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));
    var classActive = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    return `<div class='post' data-id='${postData._id}'>

                <div class='mainSectionsContainer'> 
                    <div class='userImageContainerPOSt'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                        <a  src='/profile/${postedBy.userName}'>${name}</a>
                        <span class='username'>@${postedBy.userName} </span>
                        <span class='date'>${timestamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                        <div class='postButtonContainer'>
                        <button data-toggle='modal' data-target='#replyModal'>
                            <i class='far fa-comment'></i>
                        </button>
                    </div>
                    <div class='postButtonContainer green'>
                        <button class="retweetButton">
                            <i class='fas fa-retweet'></i>
                        </button>
                    </div>
                    <div class='postButtonContainer red'>
                        <button class="likeButton ${classActive}">
                            <i class='far fa-heart'></i>
                            <span>${postData.likes.length || ""}</span>

                        </button>
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";

        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}