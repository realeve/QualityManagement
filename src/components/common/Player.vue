<template>
  <div class="aplayer"></div>
</template>
<script>
  import APlayer from 'APlayer';
  /*
  `event`:
+ `play`: Triggered when APlayer start play
+ `pause`: Triggered when APlayer paused
+ `canplay`: Triggered when enough data is available that APlayer can be played
+ `playing`: Triggered periodically when APlayer is playing
+ `ended`: Triggered when APlayer ended
+ `error`: Triggered when an error occurs
  */
  export default {
    name: 'my-player',
    props: ['music'],
    data() {
      return {
        player: ''
      }
    },
    methods: {
      init() {
        setTimeout(()=>{
          this.player = new APlayer({
            element: this.$el,
            narrow: false,
            autoplay: false,
            showlrc: false,
            mutex: true,
            theme: '#f32922',
            mode: 'random',
            music: this.music
          })
        },1000);
      }
    },
    mounted() {
      //this.init();
    }
  }

</script>
<style scoped>
  .aplayer {
    width: 600px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }

</style>
