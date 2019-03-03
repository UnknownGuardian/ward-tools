<template>
  <div id="app">
    <md-app>
      <md-app-toolbar class="md-primary noprint">
        <span class="md-title">Directory Tools</span>
      </md-app-toolbar>

      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "./styles.scss";
</style>

<style scoped>
.md-content {
  text-align: left;
}

</style>

<style>
@media print{
   .noprint{
       display:none;
   }
}
body {
  background-color: var(--md-theme-default-background, #fff);
}
#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #5E6B81;
}
.md-app-scroller {
  flex: initial;
}
.md-app-content {
  border: none !important;
}
/* Font Sizes
heading 40px
card block 28px
product.title 30px
product.price 22px
subtitle, product.owner 18px
product.description 16px
list 14px

md-display-2 45p
md-display-1 34px
md-headline 24px
md-title 20px
md-subheading 16px
md-body-2, buttons, links 14px
*/
/*.md-title {
  font-size: 20px !important;
  text-transform: uppercase;
  font-weight: 700 !important;
  letter-spacing: 0.28px;
  line-height: 24px;
}
.md-subheading {
  font-size: 18px;
  color: #354052;
  letter-spacing: 0.25px;
  line-height: 22px;
}
.md-body-1 {
  font-size: 12px;
  color: #5E6B81;
  line-height: 19px;
}
.md-body-2 {
  font-size: 15px;
  color: #354052;
  font-weight: bold;
  line-height: 32px;
}
.md-display-1 {
  font-size: 30px;
  color: #000000;
  line-height: 36px;
}
.out-of-card.md-subheading {
  color: #92979E;
  line-height: 24px;
}
*/


/* Global Styles for Cards */
.md-card.rounded {
  border-radius: 2px;
}
.md-card.rounded .md-card-header {
  padding-left: 0px;
}
.md-card.rounded .md-title {
  color: #354052;
}
.md-card.rounded .md-content {
  color: #5E6B81;
}
/* End Global Styles for Cards */



/* End Global Form Input Styles */


/* Bug fixes */

/* Remove top border on lists with checkboxes in first col */
.md-content.md-table.md-theme-default .md-table-row td {
  border-top: none;
}

</style>
