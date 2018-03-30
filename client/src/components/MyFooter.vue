<template>
  <div>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            <strong>Traceroute Map</strong> the source code is public at
            <a href="https://github.com/jianghengle/traceroute-map">
              <span class="inline-icon"><icon name="github"></icon></span>Github
            </a>.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'my-footer'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.inline-icon {
  position: relative;
  top: 2px;
  margin-right: 3px;
}
</style>
