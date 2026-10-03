const STORAGE_KEY = 'dobu_forum_posts';
let posts = [];
let displayedPosts = 0;
const POSTS_PER_PAGE = 4;

// Default sample posts 
const defaultPosts = 
[
    {
        id: 1,
        author: 'John D.',
        title: 'Best gi for beginners?',
        content: 'Hi everyone, I am just starting out with Jiu-jitsu and wondering what gi size and brand would be best for a beginner. I am about 175cm and 70kg. Any recommendations would be greatly appreciated!',
        date: '2026-08-28T10:30:00',
        replies: 5,
        views: 42
    },

    {
        id: 2,
        author: 'Sarah K.',
        title: 'Jiu-jitsu open mat schedule',
        content: 'Does anyone know when the next open mat session is? I heard there might be one this Saturday but I cannot find the details on the timetable. Thanks in advance!',
        date: '2026-08-27T15:20:00',
        replies: 3,
        views: 28
    },

    {
        id: 3,
        author: 'Mike T.',
        title: 'Tips for first Muay Thai class',
        content: 'I have my first Muay Thai class tomorrow and I am a bit nervous. What should I bring? Do I need my own gloves or does the gym provide them? Any tips for a complete beginner would be great.',
        date: '2026-08-26T18:45:00',
        replies: 8,
        views: 56
    },

    {
        id: 4,
        author: 'Emma L.',
        title: 'Looking for training partner',
        content: 'I am looking for a training partner for weekday evening sessions. I mainly train Judo and Karate, intermediate level. If anyone is interested in pairing up for drills and sparring, let me know!',
        date: '2026-08-25T12:10:00',
        replies: 2,
        views: 19
    }
];

document.addEventListener('DOMContentLoaded', function()
{
    loadPosts();
    renderPosts();
    updateStats();

    // Create post form
    const createForm = document.getElementById('createPostForm');
    if (createForm)
    {
        createForm.addEventListener('submit', function(e)
        {
            e.preventDefault();
            createNewPost();
        });
    }

    // Sort dropdown
    const sortDropdown = document.getElementById('sortDropdown');
    if (sortDropdown)
    {
        sortDropdown.addEventListener('change', function()
        {
            sortPosts(this.value);
        });
    }

    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn)
    {
        loadMoreBtn.addEventListener('click', function()
        {
            loadMorePosts();
        });
    }
});

function loadPosts()
{
    try
    {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored)
        {
            posts = JSON.parse(stored);
        } else
        {
            posts = defaultPosts.slice();
            savePosts();
        }
    } catch (e)
    {
        posts = defaultPosts.slice();
    }
}

function savePosts()
{
    try
    {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e)
    {
        alert('Error: Could not save post. Browser storage may be full or disabled.');
    }
}

function createNewPost()
{
    const author = document.getElementById('postAuthor').value.trim();
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    // Validation
    if (!author)
    {
        alert('Please enter your name.');
        document.getElementById('postAuthor').focus();
        return;
    }

    if (!title)
    {
        alert('Please enter a post title.');
        document.getElementById('postTitle').focus();
        return;
    }

    if (!content)
    {
        alert('Please enter post content.');
        document.getElementById('postContent').focus();
        return;
    }

    // Create new post
    const newPost =
    {
        id: Date.now(),
        author: author,
        title: title,
        content: content,
        date: new Date().toISOString(),
        replies: 0,
        views: 0
    };

    posts.unshift(newPost);
    savePosts();

    // Reset form
    document.getElementById('createPostForm').reset();

    // Re-render
    displayedPosts = 0;
    renderPosts();
    updateStats();

    // Success message 
    alert('Your post has been published successfully!');

    // Scroll to posts
    document.getElementById('postsList').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPosts()
{
    const postsList = document.getElementById('postsList');
    if (!postsList) return;

    postsList.innerHTML = '';

    const postsToShow = Math.min(displayedPosts + POSTS_PER_PAGE, posts.length);

    for (let i = 0; i < postsToShow; i++)
    {
        const post = posts[i];
        const postElement = createPostElement(post);
        postsList.appendChild(postElement);
    }

    displayedPosts = postsToShow;

    // Update load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn)
    {
        if (displayedPosts >= posts.length)
        {
            loadMoreBtn.style.display = 'none';
        } else
        {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}

function createPostElement(post)
{
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.setAttribute('data-id', post.id);

    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('en-GB',
    {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-GB',
    {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Build HTML with string concatenation 
    let html = '';
    html += '<div class="post-header">';
    html += '<h3 class="post-title">' + escapeHtml(post.title) + '</h3>';
    html += '<div class="post-meta">';
    html += '<span>By ' + escapeHtml(post.author) + '</span>';
    html += '<span>' + formattedDate + ' at ' + formattedTime + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="post-content-preview">' + escapeHtml(post.content) + '</div>';
    html += '<div class="post-footer">';
    html += '<div class="post-stats">';
    html += '<span>&#128172; ' + post.replies + ' replies</span>';
    html += '<span>&#128065; ' + post.views + ' views</span>';
    html += '</div>';
    html += '<button class="btn-reply" type="button" onclick="replyToPost(' + post.id + ')">Reply</button>';
    html += '</div>';

    postCard.innerHTML = html;

    return postCard;
}

function replyToPost(postId)
{
    let post = null;
    for (let i = 0; i < posts.length; i++)
    {
        if (posts[i].id === postId)
        {
            post = posts[i];
            break;
        }
    }

    if (post)
    {
        post.replies++;
        post.views++;
        savePosts();
        renderPosts();
        updateStats();
        alert('Reply feature is an extended function. In a full implementation, this would open a reply form. Reply count has been incremented for demonstration.');
    }
}

function sortPosts(sortType)
{
    if (sortType === 'newest')
    {
        posts.sort(function(a, b)
        {
            return new Date(b.date) - new Date(a.date);
        });
    } else if (sortType === 'oldest')
    {
        posts.sort(function(a, b)
        {
            return new Date(a.date) - new Date(b.date);
        });
    } else if (sortType === 'popular')
    {
        posts.sort(function(a, b)
        {
            return b.replies - a.replies;
        });
    }

    displayedPosts = 0;
    renderPosts();
}

function loadMorePosts()
{
    renderPosts();
}

function updateStats()
{
    const totalPostsEl = document.getElementById('totalPosts');
    if (totalPostsEl)
    {
        totalPostsEl.textContent = posts.length + 123;
    }
}

function escapeHtml(text)
{
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
