import $ from 'jquery'

const body = $('body')
const dropdownMenu = $('#dropdown-menu')

const activeClass = 'is-active'

dropdownMenu.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  $(this).toggleClass(activeClass)
})

body.click(function (event) {
  dropdownMenu.removeClass(activeClass)
})
