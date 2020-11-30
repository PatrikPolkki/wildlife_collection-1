'use strict';

const url = 'http://localhost:3000';

let cookies = document.cookie.split(';').
    map(cookie => cookie.split('=')).
    reduce((accumulator, [key, value]) => ({
      ...accumulator,
      [key.trim()]: decodeURIComponent(value),
    }), {});

const body = document.querySelector('body');

const galleryArea = document.querySelector('.galleryArea');

const cardContainer = document.querySelector('.card-container');

const registerForm = document.querySelector('#register');
const loginForm = document.querySelector('#login');


let user_id = cookies.loggedUser;
console.log(`Logged in user: ${user_id}`);


//for login/register form css
const hero = document.querySelector('.hero');
const x = document.getElementById('login');
const y = document.getElementById('register');
const z = document.getElementById('btn');
const login = document.getElementsByClassName('toggle-btn')[0];
const register = document.getElementsByClassName('toggle-btn')[1];


const createPicCards = async (pics) => {
  //Clear so if new picture is added, the whole json is loaded again and has to be rendered again
  galleryArea.innerHTML = '';
  try {

    for await (const pic of pics) {

      //Fetch to get interactions, likes and comments. result --> interactions of photos
      //await Promise.resolve(getLikes(pic.pic_id)).then((result) => {

      const img = document.createElement('img');

      img.src = url + '/thumbnails/' + pic.filename;

      /*
      //Create and Display modal on image click
      img.addEventListener('click', async (evt) => {
        console.log(`Clicked pic with an id of: ${pic.pic_id}`);
        cardContainer.style.display = 'flex';

        const modalp = document.createElement('p');
        modalp.id = 'modalp';

        const interactionModalLikeButton = document.createElement('span');
        interactionModalLikeButton.id = 'interactionModalLikeButton';

        const interactionModalDislikeButton = document.createElement('span');
        interactionModalDislikeButton.id = 'interactionModalDislikeButton';

        const modalForm = document.createElement('form');
        modalForm.id = 'modalForm';

        const modalInput = document.createElement('input');
        modalInput.id = 'modalInput';
        modalInput.style.width = '50%';
        modalInput.style.height = '5%';
        modalInput.id = 'modal-input';
        modalInput.type = 'text';
        modalInput.name = 'comment';
        modalInput.pattern = '.{3,}';
        modalInput.placeholder = 'Write your comment about this photo here';
        modalInput.required = true;

        const modalButton = document.createElement('button');
        modalButton.id = 'modalButton';
        modalButton.innerHTML = 'Comment';
        modalForm.appendChild(modalInput);
        modalForm.appendChild(modalButton);

        modalContent.appendChild(modalForm);
        modalContent.appendChild(modalp);
        modalContent.appendChild(interactionModalLikeButton);
        modalContent.appendChild(interactionModalDislikeButton);

        //Get up to date likes and comments from database then assign the value to elements
        const updatedLikes = await getLikes(pic.pic_id);
        console.log(updatedLikes);
        interactionModalLikeButton.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
        interactionModalDislikeButton.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;

        const comments = await getComments(pic.pic_id);
        console.log(comments);
        comments.forEach((comment) => {
          modalp.innerHTML += `<p>${comment.date} ${comment.name} ${comment.lastname}: ${comment.comment}</p>`;
        });

        //Like chosen photo
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
            interactionModalLikeButton.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;
            //... to outside the modal too
            likes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;

          } catch (e) {
            console.log(e.message);
          }
        });


        //Dislike chosen photo
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
            interactionModalDislikeButton.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;
            //... to outside the modal too
            dislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;

          } catch (e) {
            console.log(e.message);
          }
        });

        //Post a comment to selected photo
        modalForm.addEventListener('submit', async (evt) => {
          evt.preventDefault();
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
              url + `/comments/${pic.pic_id}/${user_id}`, fetchOptions);
          const json = await response.json();
          console.log('add comment response', json);

          const comments = await getComments(pic.pic_id);
          console.log(comments);
          modalp.innerHTML = '';
          comments.forEach((comment) => {
            modalp.innerHTML += `<p>${comment.date} ${comment.name} ${comment.lastname}: ${comment.comment}</p>`;
          });
        });

        //Append clicked image to the opening modal
        const modalPic = document.createElement('img');
        modalPic.src = img.src = url + '/thumbnails/' + pic.filename;
        modalPic.id = 'modalPic';
        modalContent.insertBefore(modalPic, modalContent.firstChild);

      });


      const likes = document.createElement('p');
      const dislikes = document.createElement('span')
      const updatedLikes = await getLikes(pic.pic_id);
      likes.innerHTML = updatedLikes[0].likes + '&#x1F44D;';
      dislikes.innerHTML = updatedLikes[0].dislikes + '&#128078;';

      // Incrementing for the main like button outside of modal
      likes.addEventListener('click', async (evt) => {
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

          //Fetch the updated like and update like amount to the webpage too
          const updatedLikes = await getLikes(pic.pic_id);
          likes.innerHTML = `${updatedLikes[0].likes} &#x1F44D;`;

        } catch (e) {
          console.log(e.message);
        }
      });


      // Incrementing for the main dislike button outside of modal
      dislikes.addEventListener('click', async (evt) => {
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

          const updatedLikes = await getLikes(pic.pic_id);
          dislikes.innerHTML = `${updatedLikes[0].dislikes} &#128078;`;

        } catch (e) {
          console.log(e.message);
        }
      });
       */
      const updatedLikes = await getLikes(pic.pic_id);
      console.log(updatedLikes);


      const smallCard = document.createElement('div');
      smallCard.className = 'small-card'

      const text = document.createElement('div');
      text.className = 'text';

      const owner = document.createElement('h2');
      owner.innerHTML = pic.owner;

      const likes = document.createElement('p');
      likes.innerHTML = `Likes ${updatedLikes[0].likes} Dislikes ${updatedLikes[0].dislikes}`;

      smallCard.appendChild(img);
      smallCard.appendChild(text);
      text.appendChild(owner);
      text.appendChild(likes);
      galleryArea.appendChild(smallCard);
      //     });

    }

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
    await createPicCards(pics);
  } catch (e) {
    console.log(e.message);
  }
};
getAllPicks();




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
});

// login
loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
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
  console.log('user_id', json.user.user_id);
  user_id = json.user.user_id;

  if (!json.user) {
    alert(json.message);
  } else {
    sessionStorage.setItem('token', json.token);
    console.log('token: ', sessionStorage.getItem('token'));
    //Set cookie for user id
    await setloggedUserCookie(json.user.user_id);
    cookies = document.cookie.split(';').
        map(cookie => cookie.split('=')).
        reduce((accumulator, [key, value]) => ({
          ...accumulator,
          [key.trim()]: decodeURIComponent(value),
        }), {});
  }
});

const setloggedUserCookie = async (user_id) => {
  console.log('cookieButton clicked');
  //Create the cookie
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const response = await fetch(url + '/cookie/' + user_id, fetchOptions);
  const json = await response.json();
  console.log('add cookie response', json);
};

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

const isToken = (sessionStorage.getItem('token'));
// Check for the token...if it exists do these
if (isToken) {
  console.log('is logged in');
} else {
  console.log('No token, log in plz');
}
































// these are for login/registering form css
document.querySelector('.navLogin').addEventListener('click', () => {
  hero.style.display = 'flex';
  cardContainer.style.display = 'none';
  body.style.overflow = 'hidden';
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
});
document.querySelector('.navRegister').addEventListener('click', () => {
  hero.style.display = 'flex';
  cardContainer.style.display = 'none';
  body.style.overflow = 'hidden';
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
});




register.addEventListener('click', (evt) => {
  console.log(evt);
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
});
login.addEventListener('click', (evt) => {
  console.log(evt);
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0";
});
