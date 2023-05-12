$(document).ready(() => {
    $.get('/api/posts', data => {
        console.log(data)
        outpost(data, $('.createPosthtml'))


    })
})

function outpost(data, container) {
    container.html("");
    data.forEach(element => {
        var html = createPostHtml(element)
        container.append(html)


    });
    if (data.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }

}