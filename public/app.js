const getArticles = () => {
    $("#articles").empty();

    $.getJSON("/getArticles", data => {
        for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<a class='list-group-item list-group-item-action'><h4 id='headlineTxt'>Headline: </h4> "+data[i].Headline+
        "<input type='submit' value='Save' data-id='"+data[i]._id+"' id='saveButton' class='btn btn-success'><br> <h4 id='summaryTxt'>Summary: </h4> "+data[i].Summary+"</a>");
        }
    });
}

const getSaved = () =>{

    $("#SavedArticles").empty();

    $.getJSON("/getSaved", data => {
       
        for (let i = 0; i < data.length; i++) {
            
        // append new modals, comment button, delete button for each article saved
        $("#SavedArticles").append("<div class='modal fade' id='this"+i+"' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>"+
        '<div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Add a comment</h5>'+
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>'+
        '<div class="modal-body"><ul id="commentList"></ul><input data-id="'+data[i]._id+'" id="commentTxt" type="text"></div> <div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
        '<button data-dismiss="modal" data-id="'+data[i]._id+'" id="sendComment" type="button" class="btn btn-primary">Submit</button></div></div></div></div><a class="list-group-item list-group-item-action"><h4>Headline: </h4> '+data[i].Headline+
        "<br> <h4>Summary: </h4> "+data[i].Summary+"</a>" + "<input type='submit' value='Delete' data-id='"+data[i]._id+"' id='deleteButton' class='btn btn-success'><input type='submit'"+
        " class='btn btn-primary' value='Comment' data-id='"+data[i]._id+"' id='commentButton' data-toggle='modal' data-target='#this"+i+"'>");

            for (let n = 0; n < data[i].Comments.length; n++){
                if(data[i].Comments[n].length){
                    $("#commentList").append("<li>"+data[i].Comments[n]+"</li>");
                }
            };
        };

        
    });
};

$(document).on("click", "#deleteButton", () => {
    let commentID = $(this).attr("data-id")
    console.log(commentID);
    console.log(this)
})

$(document).on("click", "#sendComment", () => {

    if($("#commentTxt").val() !== ""){
    let selectedID = $('div.modal-body input').attr("data-id"),
        newComment = $("#commentTxt").val(),
        newCommentObj = {
        Comments: newComment
    };

    $.ajax({
        method: "POST",
        url: "/addComment/"+selectedID,
        data: newCommentObj
      })
    .then( () => {
        window.location.reload();
    });

    }else
    {
        return console.log("no comment")
    }

});

$(document).on("click", "#saveButton", function(){
    let leID = $(this).attr("data-id");

    $.getJSON("/getArticle/" + leID, data => {

        var savedArt = {
            Headline: data[0].Headline,
            URL: data[0].URL,
            Summary: data[0].Summary
        }

        $.ajax({
            method: "POST",
            url: "/addSaved",
            data: savedArt
        }).then( data => {
              // Log the response
              console.log(data);
        });

        alert(`Saved Article: ${savedArt.Headline}`);
    })
})

$(document).on("click", "#getSome", () => {
    $.get("/resetArticles").done(() => {
        $.ajax("/getSome").done( () => {
            getArticles();
        });
    });
});

$(document).on("click", "#deleteButton", function(){
    let leID = $(this).attr("data-id")
    $.get("/deleteSaved/"+leID);
    getSaved();
});
(() => {
    if(window.location.pathname.includes('saved.html')){
        getSaved();
    } else {
        getArticles();
    };

})();