document.querySelectorAll('.navigation--link').forEach(link => {
  link.addEventListener('click', linkView);
});

document.querySelectorAll('.slider--chev').forEach(arrow => {
  arrow.addEventListener('click', handleArrow);
});

document.querySelectorAll('.phone--home-btn').forEach(button => {
  button.addEventListener('click', disableScreen);
});

document.querySelectorAll('.tag.tag-bordered').forEach(tag => {
  tag.addEventListener('click', switchTag);
});

document.querySelectorAll('.portfolio__img').forEach(image => {
  image.addEventListener('click', changeBorder);
});

document
  .querySelector('.contact-button button[type=submit]')
  .addEventListener('click', showWindow);

document.querySelector('.messager-btn').addEventListener('click', hideWindow);

(function() {
  let startX, startY, startTime;
  let field = document.querySelector('.slider--body');
  field.addEventListener('touchstart', event => {
    startX = event.changedTouches[0].pageX;
    startY = event.changedTouches[0].pageY;
    startTime = new Date().getTime();
  });
  field.addEventListener('touchend', () => {
    let moveX = event.changedTouches[0].pageX - startX;
    let moveY = event.changedTouches[0].pageY - startY;
    let moveTime = new Date().getTime() - startTime;
    if (moveTime < 500 && Math.abs(moveX) > 80 && Math.abs(moveY) < 30) {
      if (moveX > 0) {
        slide('right');
      } else {
        slide('left');
      }
    }
  });
})();

function showWindow(event) {
  event.preventDefault();
  if (document.sendform.checkValidity()) {
    let subj = document.sendform.subject.value;
    let desc = document.sendform.describe.value;
    document.querySelector(
      '.messager-text'
    ).innerHTML = `The letter was send<br>${
      subj ? 'Subject: ' + subj : 'Wthout subject'
    }<br>${
      desc
        ? 'Description: ' +
          (desc.length > 200 ? desc.slice(0, 200) + '...' : desc)
        : 'Without description'
    }`;
    document.querySelector('.message-window').classList.remove('hide');
  }
}

function hideWindow() {
  document.querySelector('.message-window').classList.add('hide');
}

function changeBorder(event) {
  if (event.currentTarget.classList.contains('image-bordered')) {
    event.currentTarget.classList.remove('image-bordered');
  } else {
    document.querySelectorAll('.portfolio__img').forEach(el => {
      el.classList.remove('image-bordered');
    });
    event.currentTarget.classList.add('image-bordered');
  }
}

function switchTag(event) {
  document.querySelectorAll('.tag.tag-bordered').forEach(el => {
    el.classList.remove('tag-selected');
  });
  event.currentTarget.classList.add('tag-selected');
  let list = document.querySelectorAll('.portfolio__img');
  list[0].parentNode.append(list[0]);
}

function disableScreen(event) {
  event.currentTarget.parentNode
    .querySelector('.phone--screen')
    .classList.toggle('disable-screen');
}

function linkView(event) {
  document.querySelectorAll('.navigation--link').forEach(el => {
    el.classList.remove('link-active');
  });
  event.currentTarget.classList.add('link-active');
}

function handleArrow(event) {
  if (event.currentTarget.classList.contains('left')) {
    slide('left');
  } else if (event.currentTarget.classList.contains('right')) {
    slide('right');
  }
}

slide.allowSlide = true;

function slide(dir) {
  if (!slide.allowSlide) {
    return;
  }
  slide.allowSlide = false;
  let list = document.querySelectorAll('.slide');
  let indexActive;
  list.forEach((item, index) => {
    if (item.classList.contains('active')) {
      indexActive = index;
    }
  });
  let moveNext = dir === 'left' ? -1 : 1;
  let indexNext = (indexActive + list.length + moveNext) % list.length;

  list[indexActive].addEventListener('transitionend', stopAnimActive);
  list[indexNext].addEventListener('transitionend', stopAnimNext);

  list[indexNext].classList.add(`hide-${dir}`);
  list[indexNext].classList.remove('hide');
  setTimeout(() => {
    list[indexActive].classList.add('animation');
    list[indexActive].classList.add(`active-${dir}`);
    list[indexActive].classList.remove('active');

    list[indexNext].classList.add('animation');
    list[indexNext].classList.add('active');
    list[indexNext].classList.remove(`hide-${dir}`);
  }, 100);

  function stopAnimActive() {
    this.classList.add('hide');
    this.classList.remove('animation');
    this.classList.remove(`active-${dir}`);
    this.removeEventListener('transitionend', stopAnimActive);
    setTimeout(() => {
      slide.allowSlide = true;
    }, 100);
  }

  function stopAnimNext() {
    this.classList.remove('animation');
    this.removeEventListener('transitionend', stopAnimNext);
  }
}
