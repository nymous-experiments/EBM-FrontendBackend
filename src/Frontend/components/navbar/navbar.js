import $ from 'jquery'
import {getArticles} from './navbar.service'
import {setArticlesList, showSpinner} from './navbar.utils'
import {body, dropdownMenu} from './navbar.selectors'

const activeClass = 'is-active'

dropdownMenu.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  if (!$(this).hasClass(activeClass)) {
    showSpinner()
    getArticles()
      .then(setArticlesList)
      .catch(console.error) // TODO
  }
  $(this).toggleClass(activeClass)
})

body.click(function (event) {
  dropdownMenu.removeClass(activeClass)
})
