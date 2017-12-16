import $ from 'jquery'
import {getArticles} from './navbar.service'
import {setArticlesList, showSpinner} from './navbar.utils'
import {body, dropdownMenu, navbarDropdown} from './navbar.selectors'
import {SET_ARTICLE} from '@components/article/article.events'

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

navbarDropdown.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  const articleId = event.target.dataset.id
  $(document).trigger(SET_ARTICLE, articleId)
})

body.click(function (event) {
  dropdownMenu.removeClass(activeClass)
})
