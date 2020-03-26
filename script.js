document.querySelectorAll('.navigation--link').forEach(link => {
  link.addEventListener('click', linkView);
});

document.querySelector('.menu').addEventListener('click', (e) => {
  e.currentTarget.parentNode.classList.toggle('menu-active');
});

document.querySelectorAll('.slider--chev').forEach(arrow => {
  arrow.addEventListener('click', handleArrow);
});

document.querySelectorAll('.phone--home-btn').forEach(button => {
  button.addEventListener('click', disableScreen);
});

document.querySelectorAll('.tag-bordered').forEach((tag, i) => {
  tag.addEventListener('click', switchTag);
  if (!i) {
    tag.addEventListener('click', randomMoveImage);
  } else {
    tag.addEventListener('click', orderMoveImage);
  }
});

document.querySelectorAll('.portfolio__img').forEach(image => {
  image.addEventListener('click', changeBorder);
});

(function() {
  let stopHideHeader;
  let header = document.querySelector('.header');

  let listLink = document.querySelectorAll('.navigation--link');
  let listSection = document.querySelectorAll('header,section');
  let activeLink;
  listLink.forEach(el => {
    if (el.classList.contains('link-active')) {
      activeLink = el.getAttribute('href').slice(1);
    }
  });
    

  document.onscroll = () => {
    let position = window.scrollY;

    clearTimeout(stopHideHeader);
    header.classList.remove('show-header');
    if (position > 300) {
      header.classList.add('show-header');
      stopHideHeader = setTimeout(() => {
        header.classList.remove('show-header');
      }, 5000);
    }

    listSection.forEach((el, i) => {
      if (
        el.offsetTop <= position + 90 &&
        (i === listSection.length - 1 ||
          listSection[i+1].offsetTop > position + 90)
      ) {
        if (el.id !== activeLink) {
          listLink.forEach(elLink => {
            if (elLink.getAttribute('href').slice(1) === el.id) {
              elLink.classList.add('link-active');
              activeLink = el.id;
            } else {
              elLink.classList.remove('link-active');
            }
          });
        }
      }
    });
  };
})();

(function() {
  document.querySelector('#submit').addEventListener('click', showWindow);
  document.querySelector('.message')
    .addEventListener('click', hideWindowBtn);

  let stopTimer;

  function showWindow(event) {
    event.preventDefault();
    if (!document.send.checkValidity()) {
      document.send.reportValidity();
    } else {
      document.querySelector('.content').classList.add('blur');
      document.body.style.overflow = 'hidden';
      let subj = document.send.subject.value;
      let desc = document.send.describe.value;
      let messageString = 'The letter was send<br>';
      messageString +=  !subj ? 'Without subject'
          : 'Subject: ' + (subj.length > 100 ? subj.slice(0, 100) + '...' : subj);
      messageString += '<br>';
      messageString += !desc ? 'Without description'
          : 'Description: ' + (desc.length > 100 ? desc.slice(0, 100) + '...' : desc);
      document.querySelector('.message-text').innerHTML  = messageString;
      document.querySelector('.message').classList.remove('hide');
      stopTimer = setTimeout(hideWindow, 5000);
    }
  }

  function hideWindowBtn(event) {
    if (
      event.target.classList.contains('message') ||
      event.target.classList.contains('message-btn')
    ) {
      hideWindow();
      clearTimeout(stopTimer);
    }
  }

  function hideWindow() {
    document.querySelector('.message').classList.add('hide');
    document.querySelector('.content').classList.remove('blur');
    document.body.style.overflow = '';
    document.send.reset();
  }
})();

(function() {
  let startX, startY, startTime;
  let field = document.querySelector('.slider--body');

  field.addEventListener('touchstart', event => {
    if (event.target.classList.contains('left')) {
      slide('left');
      return;
    } else if (event.target.classList.contains('right')) {
      slide('right');
      return;
    }
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
  document.querySelectorAll('.tag.tag-bordered').forEach((el) => {
    el.classList.remove('tag-selected');
  });
  event.currentTarget.classList.add('tag-selected');
}

function orderMoveImage() {
  let list = document.querySelectorAll(
    '.portfolio__pictures>.layout_4_column>div'
  );
  list[0].parentNode.append(list[0]);
}

function randomMoveImage() {
  let list = Array.from(
    document.querySelectorAll('.portfolio__pictures>.layout_4_column>div')
  );
  while (list.length) {
    let index = Math.floor(Math.random() * list.length);
    list[0].parentNode.append(list.splice(index, 1)[0]);
  }
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
  let indexActive = 0;
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
  setTimeout(() => {
    list[indexActive].classList.add('animation', `active-${dir}`);
    list[indexActive].classList.remove('active');
    list[indexNext].classList.add('animation', 'active');
    list[indexNext].classList.remove(`hide-${dir}`);
  }, 100);

  function stopAnimActive() {
    this.classList.remove('animation', `active-${dir}`);
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
