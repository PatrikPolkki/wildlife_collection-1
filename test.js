'use strict';

const url = 'http://localhost:3000';
mapboxgl.accessToken = 'pk.eyJ1IjoicGV4aSIsImEiOiJja2hhN241bzYweXBtMnBuenA5Y3NxOGlmIn0.b1NkQwYNPY04r4MBe99rBQ';
const map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [24.92398406198174, 60.18035205606998], // starting position
  zoom: 7, // starting zoom
});
let marker;

const body = document.querySelector('body');
const galleryArea = document.querySelector('.galleryArea');

const cardContainer = document.querySelector('.card-container');
const gradient = document.querySelector('.gradient');
const commentsection = document.querySelector('.comments');
const likeSection = document.querySelector('.likeSection');
const deleteButton = document.querySelector('.deleteButton');

const closeInteractionModel = document.querySelector('.exit');
const closeHeroForm = document.querySelector('.loginExit');
const closeMapModal = document.querySelector('.exitMap');

const registerForm = document.querySelector('#register');
const loginForm = document.querySelector('#login');

//for login/register form css
const hero = document.querySelector('.hero');
const x = document.getElementById('login');
const y = document.getElementById('register');
const z = document.getElementById('btn');
const login = document.getElementsByClassName('toggle-btn')[0];
const register = document.getElementsByClassName('toggle-btn')[1];

//not logged user navbar
const links = document.querySelector('.links');
//logged user navbar
const istokenLinks = document.querySelector('.otherLinks');

//clear the image card
closeInteractionModel.addEventListener('click', (evt) => {
  console.log(evt);
  clearCardContainer();
});
//close register and login form
closeHeroForm.addEventListener('click', (evt) => {
  console.log(evt);

  hero.style.display = 'none';
  body.style.overflow = 'auto';
});
//close map
closeMapModal.addEventListener('click', async (evt) => {
  evt.preventDefault();
  document.querySelector('.map-container').style.display = 'none';
  marker.remove();
});

//creates small image cards and by clicking by them it opens up larger image card with more information and functionalites
const createPicCards = async (pics) => {
  //Clear so if new picture is added, the whole json is loaded again and has to be rendered again
  galleryArea.innerHTML = '';
  try {

    for await (const pic of pics) {

      //Fetch to get interactions, likes and comments. result --> interactions of photos
      //await Promise.resolve(getLikes(pic.pic_id)).then((result) => {

      //Get up to date from database then assign the value to elements
      const updatedLikes = await getLikes(pic.pic_id);
      console.log(updatedLikes);

      const smallCard = document.createElement('div');
      smallCard.className = 'small-card';

      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + pic.filename;

      smallCard.appendChild(img);

      //Create and Display modal on image click
      smallCard.addEventListener('click', async (evt) => {
        console.log(`Clicked pic with an id of: ${pic.pic_id}`);
        cardContainer.style.display = 'flex';
        body.style.overflow = 'hidden';

        const modalMapButton = document.querySelector('.map');
        modalMapButton.addEventListener('click', async (evt) => {
          evt.preventDefault();
          console.log(evt);
          console.log('mapbutton coords: ', pic.coords);
          document.querySelector('.map-container').style.display = 'flex';

          try {
            const mapCanvas = document.getElementsByClassName(
                'mapboxgl-canvas')[0];

            mapCanvas.style.width = '100%';
            mapCanvas.style.height = '100%';
            map.resize();
          } catch (e) {
            console.log(e);
          }

          try {
            const coords = JSON.parse(pic.coords);
            addMarker(coords);
          } catch (e) {
          }
        });
        //Append clicked image to the opening modal
        const modalPic = document.createElement('img');
        modalPic.src = img.src = url + '/thumbnails/' + pic.filename;
        gradient.appendChild(modalPic);

        const username = document.createElement('h1');
        username.className = 'username';
        username.innerHTML = `${pic.name} ${pic.lastname}`;
        document.querySelector('.header div').appendChild(username);

        const comments = await getComments(pic.pic_id);
        console.log(comments);
        comments.forEach((comment) => {
          const commentText = document.createElement('p');
          commentText.className = 'commentText';
          commentText.innerHTML += comment.comment;
          commentsection.appendChild(commentText);
        });

        const date = document.createElement('div');
        date.className = 'date';
        const postDate = pic.post_date.replace('T', ' ').replace('Z', '');
        date.innerHTML = `${postDate}`;

        const likes = document.createElement('div');
        likes.className = 'likes';
        const thumbsUp = document.createElement('div');
        thumbsUp.className = 'thumbs';
        const thumbsDown = document.createElement('div');
        thumbsDown.className = 'thumbs';

        const interactionModalLikeButton = document.createElement('p');
        interactionModalLikeButton.className = 'like';
        const interactionModalDislikeButton = document.createElement('p');
        interactionModalDislikeButton.className = 'like';

        thumbsUp.appendChild(interactionModalLikeButton);
        thumbsDown.appendChild(interactionModalDislikeButton);

        likes.appendChild(thumbsUp);
        likes.appendChild(thumbsDown);

        likeSection.appendChild(date);
        likeSection.appendChild(likes);

        //Get up to date from database then assign the value to elements
        const updatedLikes = await getLikes(pic.pic_id);
        console.log(updatedLikes);
        interactionModalLikeButton.innerHTML = `&#x1F44D; ${updatedLikes[0].likes}`;
        interactionModalDislikeButton.innerHTML = `&#128078; ${updatedLikes[0].dislikes}`;

        //Like photo
        interactionModalLikeButton.addEventListener('click', async (evt) => {
          evt.preventDefault();

          console.log(pic.pic_id);
          try {
            const options = {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              },
            };
            console.log(options);
            const response = await fetch(
                url + '/likes/incrementlike/' + pic.pic_id, options);
            const json = await response.json();
            console.log('add like response', json);

            //Fetch the updated like and update like amount
            const updatedLikes = await getLikes(pic.pic_id);
            interactionModalLikeButton.innerHTML = `&#x1F44D; ${updatedLikes[0].likes}`;
            //... to outside the modal too

          } catch (e) {
            console.log(e.message);
          }
        });

        //Dislike photo
        interactionModalDislikeButton.addEventListener('click', async (evt) => {
          evt.preventDefault();

          console.log(pic.pic_id);
          try {
            const options = {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              },
            };
            console.log(options);
            const response = await fetch(
                url + '/likes/incrementdislike/' + pic.pic_id, options);
            const json = await response.json();
            console.log('add like response', json);

            //Fetch the updated dislike and update dislike amount
            const updatedLikes = await getLikes(pic.pic_id);
            interactionModalDislikeButton.innerHTML = `&#128078; ${updatedLikes[0].dislikes}`;
            //... to outside the modal too

          } catch (e) {
            console.log(e.message);
          }
        });
        const commentArea = document.querySelector('.commentArea');
        commentArea.name = 'comment';
        commentArea.removeAttribute('readonly');
        const commentButton = document.querySelector('.commentButton');
        commentButton.removeAttribute('disabled')
        const modalForm = document.querySelector('#commentForm');

        //Post a comment to selected photo
        modalForm.addEventListener('submit', async (evt) => {
          evt.preventDefault();
          if (commentArea.value !== '') {
            const data = serializeJson(modalForm);
            const fetchOptions = {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            };
            console.log(fetchOptions);
            const response = await fetch(
                url + `/comments/${pic.pic_id}`, fetchOptions);
            const json = await response.json();
            console.log('add comment response', json);

            const comments = await getComments(pic.pic_id);

            console.log(comments);

            commentsection.innerHTML = '';
            comments.forEach((comment) => {
              const commentText = document.createElement('p');
              commentText.className = 'commentText';
              commentText.innerHTML += comment.comment;
              commentsection.appendChild(commentText);
            });
          } else {
            alert('Write a comment');
          }
        });

        // Used to check if currently logged in user owner of the pic (or admin)
        const checkOwnerShip = async () => {
          const fetchOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(url + '/pic/picuserid/' + pic.pic_id,
              fetchOptions);
          //console.log('owner status:', json);
          return await response.json();
        };

        // Check if the logged user owns the photo, if so make button to be allowed to delete the photo
        const checkOwner = await checkOwnerShip().then((result) => {
          if (result.result === true) {
            const deletePicButton = document.createElement('a');
            deleteButton.appendChild(deletePicButton);
            deletePicButton.className = 'delete';
            deletePicButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
            deletePicButton.addEventListener('click', async (evt) => {
              evt.preventDefault();
              console.log(`Delete pressed at ${pic.pic_id}`);
              try {
                const options = {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Bearer ' +
                        sessionStorage.getItem('token'),
                  },
                };
                console.log(options);
                const response = await fetch(
                    url + '/pic/delete/' + pic.pic_id, options);
                const json = await response.json();
                console.log('Delete response: ', json);

              } catch (e) {
                console.log(e.message);
              }
              clearCardContainer();
              await getPicsByOwner();
            });
          }
        });

        await checkOwner;
      });

      const text = document.createElement('div');
      text.className = 'text';

      const owner = document.createElement('h2');
      owner.innerHTML = `${pic.name} ${pic.lastname}`;

      const likes = document.createElement('p');
      likes.innerHTML = `Likes ${updatedLikes[0].likes} Dislikes ${updatedLikes[0].dislikes}`;

      smallCard.appendChild(text);
      text.appendChild(owner);
      text.appendChild(likes);
      galleryArea.appendChild(smallCard);

    }

  } catch (e) {
    console.log(e.message);
  }
};

//creates same cards as "createPicCards", but without any eventlisteners, so not logged user can see the content
const createPicCardsNoToken = async (pics) => {
  //Clear so if new picture is added, the whole json is loaded again and has to be rendered again
  galleryArea.innerHTML = '';
  try {

    for await (const pic of pics) {

      //Fetch to get interactions, likes and comments. result --> interactions of photos
      //await Promise.resolve(getLikes(pic.pic_id)).then((result) => {

      //Get up to date from database then assign the value to elements
      const updatedLikes = await getLikesNoToken(pic.pic_id);
      console.log(updatedLikes);

      const smallCard = document.createElement('div');
      smallCard.className = 'small-card';

      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + pic.filename;

      smallCard.appendChild(img);

      //Create and Display modal on image click
      smallCard.addEventListener('click', async (evt) => {
        console.log(`Clicked pic with an id of: ${pic.pic_id}`);
        cardContainer.style.display = 'flex';
        body.style.overflow = 'hidden';

        const modalMapButton = document.querySelector('.map');
        modalMapButton.addEventListener('click', async (evt) => {
          evt.preventDefault();
          console.log(evt);
          console.log('mapbutton coords: ', pic.coords);
          document.querySelector('.map-container').style.display = 'flex';

          try {
            const mapCanvas = document.getElementsByClassName(
                'mapboxgl-canvas')[0];

            mapCanvas.style.width = '100%';
            mapCanvas.style.height = '100%';
            map.resize();
          } catch (e) {
            console.log(e);
          }

          try {
            const coords = JSON.parse(pic.coords);
            addMarker(coords);
          } catch (e) {
          }
        });
        //Append clicked image to the opening modal
        const modalPic = document.createElement('img');
        modalPic.src = img.src = url + '/thumbnails/' + pic.filename;
        gradient.appendChild(modalPic);

        const username = document.createElement('h1');
        username.className = 'username';
        username.innerHTML = `${pic.name} ${pic.lastname}`;
        document.querySelector('.header div').appendChild(username);

        const comments = await getCommentsNoToken(pic.pic_id);
        console.log(comments);
        comments.forEach((comment) => {
          const commentText = document.createElement('p');
          commentText.className = 'commentText';
          commentText.innerHTML += comment.comment;
          commentsection.appendChild(commentText);
        });

        const date = document.createElement('div');
        date.className = 'date';
        const postDate = pic.post_date.replace('T', ' ').replace('Z', '');
        date.innerHTML = `${postDate}`;

        const likes = document.createElement('div');
        likes.className = 'likes';
        const thumbsUp = document.createElement('div');
        thumbsUp.className = 'thumbs';
        const thumbsDown = document.createElement('div');
        thumbsDown.className = 'thumbs';

        const interactionModalLikeButton = document.createElement('p');
        interactionModalLikeButton.className = 'like';
        const interactionModalDislikeButton = document.createElement('p');
        interactionModalDislikeButton.className = 'like';

        thumbsUp.appendChild(interactionModalLikeButton);
        thumbsDown.appendChild(interactionModalDislikeButton);

        likes.appendChild(thumbsUp);
        likes.appendChild(thumbsDown);

        likeSection.appendChild(date);
        likeSection.appendChild(likes);

        //Get up to date from database then assign the value to elements
        const updatedLikes = await getLikesNoToken(pic.pic_id);
        console.log(updatedLikes);
        interactionModalLikeButton.innerHTML = `&#x1F44D; ${updatedLikes[0].likes}`;
        interactionModalDislikeButton.innerHTML = `&#128078; ${updatedLikes[0].dislikes}`;



        // Used to check if currently logged in user owner of the pic (or admin)
        const checkOwnerShip = async () => {
          const fetchOptions = {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
              'Content-Type': 'application/json',
            },
          };
          const response = await fetch(url + '/pic/picuserid/' + pic.pic_id,
              fetchOptions);
          //console.log('owner status:', json);
          return await response.json();
        };
      });

      const text = document.createElement('div');
      text.className = 'text';

      const owner = document.createElement('h2');
      owner.innerHTML = `${pic.name} ${pic.lastname}`;

      const likes = document.createElement('p');
      likes.innerHTML = `Likes ${updatedLikes[0].likes} Dislikes ${updatedLikes[0].dislikes}`;

      smallCard.appendChild(text);
      text.appendChild(owner);
      text.appendChild(likes);
      galleryArea.appendChild(smallCard);

    }

  } catch (e) {
    console.log(e.message);
  }
};
const getAllPicksNoToken = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/notokenpic', options);
    const pics = await response.json();
    console.log(pics);

    showNotLoggedNav();
    await createPicCardsNoToken(pics);
  } catch (e) {
    console.log(e.message);
  }
};

const getAllPicks = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic', options);
    const pics = await response.json();
    console.log(pics);

    showLoggedNav();
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};
const getPicsByOwner = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/pic/userpics', options);
    const pics = await response.json();
    console.log(pics);
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};

// Register
registerForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(registerForm);
  //const fd = new FormData(registerForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  console.log(fetchOptions);
  const response = await fetch(url + '/auth/register', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  // Save token
  sessionStorage.setItem('token', json.token);

  // Hide login and registration forms
  hero.style.display = 'none';
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = await serializeJson(loginForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);

  if (!json.user) {
    alert(json.message);
  } else {
    //Set token
    sessionStorage.setItem('token', json.token);
    console.log('token: ', sessionStorage.getItem('token'));

    // Hide login and registration forms
    hero.style.display = 'none';
    body.style.overflow = 'auto';
    showLoggedNav();

    await getAllPicks();
  }
});

//Logout logged in user
const logout = document.querySelector('.logOut');
logout.addEventListener('click', async (evt) => {
  evt.preventDefault();

  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/auth/logout', options);
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    alert('You have logged out');


    galleryArea.innerHTML = '';
    showNotLoggedNav();
  } catch (e) {
    console.log(e.message);
  }
});

//logged user navbar functionalities
const profile = document.querySelector('.profile');
profile.addEventListener('click', async (evt) => {
  evt.preventDefault();
  getPicsByOwner();
});

const logo = document.querySelector('.logo');
logo.addEventListener('click', async (evt) => {
  evt.preventDefault();
  getAllPicks();
});

//likes and comments
const getLikes = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/likes/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};
const getComments = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/comments/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};

//get likes and comments for not logged user but prevents not logged user actions
const getLikesNoToken = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/notokenlikes/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};
const getCommentsNoToken = async (pic_id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/notokencomments/' + pic_id,
        options);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
};



//add marker into map
const addMarker = (coords) => {
  map.setCenter(coords);
  marker = new mapboxgl.Marker().setLngLat(coords).addTo(map);
};

//some simple functions
const clearCardContainer = () => {
  gradient.innerHTML = '';
  document.querySelector('.header div').innerHTML = '';
  commentsection.innerHTML = '';

  likeSection.innerHTML = '';
  likeSection.innerHTML = '';

  deleteButton.innerHTML = '';

  cardContainer.style.display = 'none';
  body.style.overflow = 'auto';
}
const showLoggedNav = () => {
  links.style.display = 'none';
  istokenLinks.style.display = 'flex';

  document.querySelector('.logOut').innerHTML = 'Log Out';
  document.querySelector('.profile').innerHTML = 'Profile';
};
const showNotLoggedNav = () => {
  links.style.display = 'flex';
  istokenLinks.style.display = 'none';

  document.querySelector('.mainlinks').innerHTML = 'About';
  document.querySelector('.navRegister').innerHTML = 'Register';
  document.querySelector('.navLogin').innerHTML = 'Log In';
};

//For now the webpage loads the pictures owned by the logged in user
//Change called function to adjust
const isToken = (sessionStorage.getItem('token'));
// Check for the token...if it exists do these
if (isToken) {
  getAllPicks().then(() => {
    console.log('token: ', sessionStorage.getItem('token'));
  });
} else {
  getAllPicksNoToken().then(() => {
    console.log('No token, log in plz');
  });
}

// these are for login/registering form css
document.querySelector('.navLogin').addEventListener('click', () => {
  hero.style.display = 'flex';
  cardContainer.style.display = 'none';
  body.style.overflow = 'hidden';
  x.style.left = '50px';
  y.style.left = '450px';
  z.style.left = '0';
});
document.querySelector('.navRegister').addEventListener('click', () => {
  hero.style.display = 'flex';
  cardContainer.style.display = 'none';
  body.style.overflow = 'hidden';
  x.style.left = '-400px';
  y.style.left = '50px';
  z.style.left = '110px';
});
register.addEventListener('click', (evt) => {
  console.log(evt);
  x.style.left = '-400px';
  y.style.left = '50px';
  z.style.left = '110px';
});
login.addEventListener('click', (evt) => {
  console.log(evt);
  x.style.left = '50px';
  y.style.left = '450px';
  z.style.left = '0';
});