<script setup lang="ts">
import type {CategoryArticleDto} from "~/api/content/article-category/model";
import {listArticles} from "~/api/content/article";
import type {StoreSetting} from "~/api/settings/store-setting/model";
import {useSettingStore} from "~/store/useSettingStore";

const setting = useSettingStore().setting as StoreSetting;

const active = ref(0);
const CategoryArticleList = ref<CategoryArticleDto[]>([]);

await useAsyncData("read_article", async () => listArticles()).then((d) => {
  CategoryArticleList.value = d.data.value as CategoryArticleDto[];
})

useHead({
  title: '我的帮助 - ' + setting.description,
  meta: [
    { name: 'Keywords', content: setting.keywords },
    { name: 'description', content: setting.description },
  ],
})
</script>

<template>
  <div>
    <div>
      <van-tabs
          v-model:active="active"
          shrink
          swipeable
          sticky
          animated
          :offset-top="65"
          line-width="20px"
          title-active-color="var(--bomaos-color-primary)"
      >
        <van-tab v-for="item in CategoryArticleList" :title="item.name" :key="item.id">
          <div style="margin: 15px">
            <n-card
                :bordered="false"
                :segmented="{
                  content: true,
                  footer: 'soft'
                }"
                :content-style="{padding: 0}"
            >
              <mobile-blog-article-item v-for="item in item.articleDtoList" :key="item.id" :article="item"/>
            </n-card>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped lang="less">
.bomaos_article_header {
  padding: 25px 20px;
  background-color: var(--bomaos-color-primary);
}

:deep(.van-tab) {
  font-size: 17px;
}

:deep(.van-tabs__line) {
  background: var(--bomaos-color-primary);
}

:deep(.van-tabs__line) {
  bottom: 23px;
}

:deep(.van-tabs--line .van-tabs__wrap) {
  height: 55px;
}
</style>