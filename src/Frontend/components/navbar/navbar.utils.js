import $ from 'jquery'

import {dropdownMenu, navbarDropdown} from './navbar.selectors'

const activeClass = 'is-active'

export function showSpinner () {
  navbarDropdown.empty()
  navbarDropdown.append(
    $(`<div class="custom-spinner-container"><span class="custom-spinner"></span></div>`)
  )
}

export function setArticlesList (data) {
  navbarDropdown.empty()
  data.forEach((article) => {
    navbarDropdown.append(
      $(`<a href="#" class="navbar-item" data-id="${article.id}">${article.title}</a>`)
    )
  })
}

export function isDropdownOpen () {
  dropdownMenu.hasClass(activeClass)
}

export function closeDropdown () {
  dropdownMenu.removeClass(activeClass)
}

export function toggleDropdown () {
  dropdownMenu.toggleClass(activeClass)
}
