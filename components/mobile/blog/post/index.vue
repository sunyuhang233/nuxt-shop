<script setup lang="ts">
import type {Article} from "~/api/content/article/model";
import {getArticle} from "~/api/content/article";
import {computed, onMounted, ref} from "vue";
// 1. 引入css
import '~/plugins/xgplayer/payTip/index.css'
import 'xgplayer/dist/index.min.css'
import 'xgplayer/es/plugins/danmu/index.css'
import PresetPlayer from "xgplayer";

const dayjs = useDayjs();

const props = defineProps<{
  // 弹窗是否打开
  articleId?: number;
}>();

// 视频组件
let player: PresetPlayer | null = null;

const article = ref<Article>({});
const loading = ref(false);

/**
 * 获取文章内容
 * @param id
 */
await useAsyncData("read_article", async () => getArticle(props.articleId as unknown as number)).then((res) => {
  article.value = res.data.value as Article;
})

onMounted(async () => {
  const [Player] = await Promise.all([
    import('xgplayer'),
    import("xgplayer-mp4")
  ])
  if (article.value.isVideo === 1) {
    player = new Player.default({
      id: 'video',
      controls: {
        autoHide: true
      },
      fluid: true,
      autoplay: false,
      volume: 0.3,
      url: article.value?.videoUrl,
      poster: article.value.videoCover,
      playsinline: true,
      height: '100%',
      width: '100%'
    })
  }
})

definePageMeta({
  key: route => route.fullPath
})

useHead({
  title: computed(() => {
    if (article.value.id && article.value.title) {
      return article.value.title
    } else {
      return '404'
    }
  }),
  titleTemplate: (title) => `${title} - 鱼七博客`,
  meta: [
    { name: 'Keywords', content: computed(() => {
        if (article.value.id && article.value.title) {
          return '鱼七博客,' + article.value.title + ',教程,博客模板,个人博客,开源博客,vue3,nuxt3'
        } else {
          return '404'
        }
      })},
    { name: 'description', content: computed(() => {
        if (article.value.id) {
          return article.value.summary ?? '致力于分享前后端教程'
        } else {
          return '404'
        }
      })
    },
    {
      name: 'referrer', content: 'no-referrer'
    }
  ],
})
</script>

<template>
  <div>
    <n-card
        :bordered="false"
        :segmented="{
                content: true,
                footer: 'soft'
              }"
        :content-style="{padding: '15px'}"
    >
      <div>
        <div v-if="article?.isVideo">
          <div style="background-color: #eaeaea" :style="{ minHeight: '186px' }">
            <div id="video"></div>
          </div>
        </div>
        <n-divider v-if="article?.isVideo" style="margin: 15px 0"/>
        <div class="bomaos-card">
          <div>
            <div class="header">
              <span class="title" :style="{ fontSize: '17px' }">{{ article.title }}</span>
              <div style="margin-top: 5px; color: #666; font-size: 15px">
                <n-space>
                  <div>{{ article.createTime }}</div>
                  <van-divider vertical style="margin: 0" :hairline="false"/>
                  <div style="display: flex; align-items: center;">
                    <Icon name="octicon:eye" style="font-size: 15px"/>
                    <span style="margin-left: 5px">{{ article.seeNumber }}</span>
                  </div>
                </n-space>
              </div>
            </div>
            <common-view-md :content="article.content as string" />
            <n-alert type="warning" style="margin-top: 15px">
              本文章为原创作品如转载请注明出处、谢谢您的支持。
            </n-alert>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped lang="less">
:deep(.xgplayer .xgplayer-poster) {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 50%;
}

.bomaos-card {
  .header {
    margin-bottom: 30px;
    .title {
      font-size: 25px;
      font-weight: bold;
    }
  }
}
</style>