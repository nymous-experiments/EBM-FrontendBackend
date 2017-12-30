import $ from 'jquery'

import {createArticle, listArticles} from '@services/article.service'

import {closeDropdown, isDropdownOpen, setArticlesList, showSpinner, toggleDropdown} from './navbar.utils'
import {body, dropdownMenu, navbarDropdown, newArticleButton} from './navbar.selectors'

import {SET_ARTICLE} from '@components/article/article.customEvents'

dropdownMenu.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  if (!isDropdownOpen()) {
    showSpinner()
    listArticles()
      .then(setArticlesList)
      .catch(console.error) // TODO
  }
  toggleDropdown()
})

navbarDropdown.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  const target = $(event.target)
  if (target.is('a')) {
    const articleId = event.target.dataset.id
    $(document).trigger(SET_ARTICLE, articleId)
    closeDropdown()
  }
})

body.click(function (event) {
  closeDropdown()
})

newArticleButton.click(function (event) {
  createArticle()
    .then((article) => {
      $(document).trigger(SET_ARTICLE, article.id)
    })
    .catch(err => console.error(err))
})
