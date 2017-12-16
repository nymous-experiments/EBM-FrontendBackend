import $ from 'jquery'

import {getArticles} from './navbar.service'
import {closeDropdown, isDropdownOpen, setArticlesList, showSpinner, toggleDropdown} from './navbar.utils'
import {body, dropdownMenu, navbarDropdown} from './navbar.selectors'
import {CLOSE_DROPDOWN} from './navbar.customEvents'

import {SET_ARTICLE} from '@components/article/article.customEvents'

dropdownMenu.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  if (!isDropdownOpen()) {
    showSpinner()
    getArticles()
      .then(setArticlesList)
      .catch(console.error) // TODO
  }
  toggleDropdown()
})

navbarDropdown.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  const articleId = event.target.dataset.id
  $(document).trigger(SET_ARTICLE, articleId)
})

$(document).on(CLOSE_DROPDOWN, function (event) {
  event.stopPropagation()
  event.preventDefault()
  closeDropdown()
})

body.click(function (event) {
  closeDropdown()
})
