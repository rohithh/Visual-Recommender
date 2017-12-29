$(document).ready(function(){
    $('#votes-text').qtip({
        content: 'Specify number of votes',
        show: {
            //event: 'onload', // Don't specify a show event
            when: false,
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

    $('#views-text').qtip({
        content: 'Specify number of views',
        show: {
            when: false, // Don't specify a show event
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

    $('#answers-text').qtip({
        content: 'Specify number of answers',
        show: {
            when: false, // Don't specify a show event
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

    $('#question').qtip({
        content: 'Enter your question',
        show: {
            when: false, // Don't specify a show event
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

    $('#recommendPosts').qtip({
        content: 'Once you submit the question, posts will be recommended!',
        show: {
            when: false, // Don't specify a show event
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

    $('#tags').qtip({
        content: 'Tag bubble chart will populate on submitting the question',
        show: {
            when: false, // Don't specify a show event
            ready: true, // Show the tooltip when ready
            delay: 500
        },
        hide: {
                event: 'mouseout',
                target: $('body', this)
        }
    })

});
