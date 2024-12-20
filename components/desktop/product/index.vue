<script setup lang="ts">
import type {Product} from "~/api/product/product/model";
import {getProduct} from "~/api/product/product";
import type {Category} from "~/api/product/category/model";
import {type FormInst, NImage, type SelectOption} from "naive-ui";
import type {CreateOrdersParam, PaymentResult} from "~/api/income/orders/model";
import {createOrder} from "~/api/income/orders";
import type {VNodeChild} from "vue";
import {listPayConfigs} from "~/api/settings/pay-config";
import type {PayConfig} from "~/api/settings/pay-config/model";
import {messageLoading} from "~/utils/message-loading";

const { $isMobile, $isDesktop, $isTablet } = useNuxtApp();

const props = defineProps<{
  // 弹窗是否打开
  uniqueLink: string;
}>();

const token = useCookie("token");

//
const formRef = ref<FormInst | null>(null)

// 商品
const product = ref<Product>({});
const category = ref<Category>();
const money = ref<number>(0);
const defaultCover = ref<string>();
const activeType = ref<number>(0);
const paymentActiveType = ref<number>(0);
const paymentList = ref<PayConfig[]>([]);

// 存储商品的单价
const unitPrice = ref<number>(0);

/**
 * 订单提交字段
 */
const { form } = useFormData<CreateOrdersParam>({
  productId: undefined,
  categoryId: undefined,
  couponCode: '',
  number: undefined,
  paymentType: '',
  // 初始化动态字段对象
  dynamicFields: {}
})

const rules = reactive({
  categoryId: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择商品品类'
  },
  number: {
    type: 'number',
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入购买的商品数量'
  },
  paymentType: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择支付方式'
  },
})

const generalOptions = ref<SelectOption[]>([]);

/**
 * 查询商品
 */
await useAsyncData("read_product", async () => getProduct(props.uniqueLink)).then((d) => {
  product.value = d.data.value as Product;
  money.value = product.value.price as number;
  unitPrice.value = product.value.price as number;
  form.productId = product.value.productId;
  form.number = product.value.minPurchaseQuantity;

  /**
   * 判断是否开启品类
   * 开启品类后初始化品类列表
   * 设置默认选中第一个品类
   */
  if (product.value.categoryEnabled === 1 && product.value.categoryList) {
    generalOptions.value = product.value.categoryList.map(
        (v) => ({
          label: v.name,
          value: v.categoryId,
          category: v
        })
    )
    form.number = (product.value.categoryList as Category[])[0].minPurchaseQuantity;
    activeType.value = (product.value.categoryList as Category[])[0].categoryId as number;
    defaultCover.value = (product.value.categoryList as Category[])[0].coverImage;
    money.value = (product.value.categoryList as Category[])[0].price as number;
    unitPrice.value = (product.value.categoryList as Category[])[0].price as number;
    form.categoryId = (product.value.categoryList as Category[])[0].categoryId;
    category.value = (product.value.categoryList as Category[])[0];
  }
}).catch(() => {
  /**
   * 没拿到数据或商品已下架
   * 用于前台判断商品是否上架
   */
  product.value = {};
})

/**
 * 获取支付渠道列表
 */
await useAsyncData("read_pay_config", async () => listPayConfigs()).then((d) => {
  paymentList.value = d.data.value.filter((config) => {
    if ($isMobile() || $isTablet()) {
      return config.isMobile === 1; // 过滤支持移动端的配置
    } else if ($isDesktop()) {
      return config.isDesktop === 1; // 过滤支持电脑端的配置
    }
    return false; // 如果设备类型不明确，不显示任何配置
  });
})

/**
 * 品类列表Item自定义样式配置
 * @param option
 */
const renderLabel = (option: SelectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return [
    h('div', { style: 'display: flex; align-items: center' }, [
          h(
              NImage,
              {
                width: '20px',
                height: '20px',
                fit: "cover",
                previewDisabled: true,
                src: (option.category as Category).coverImage
              }
          ),
          h('div', { style: 'margin-left: 7px;'}, option.label as string + ' (' + (option.category as Category).price + '元)')
        ]
    )
  ]
}

/**
 * 选择商品品类
 *
 * @param value
 * @param option
 */
const handleUpdateValue = (value: string, option: SelectOption) => {
  // 初始化数量为1
  form.number = (option.category as Category).minPurchaseQuantity;
  console.log(form)
  // 清除动态字段数据
  form.dynamicFields = {};
  activeType.value = (option.category as Category).categoryId as number;
  defaultCover.value = (option.category as Category).coverImage as string;
  money.value = (option.category as Category).price as number;
  unitPrice.value = (option.category as Category).price as number;
  form.categoryId = (option.category as Category).categoryId as number;
  category.value = option.category as Category;
}

/**
 * 切换支付方式
 * @param value
 */
const onSwitchPayment = (value: PayConfig) => {
  paymentActiveType.value = value.id as number;
  form.paymentType = value.driver as string;
}

/**
 * 处理自定义输入框配置
 * @param value
 */
const processedCustomData = (value: string) => {
  return value.split('\n').map(item => item.split('='));
};

const dynamicInputSource = computed(() => {
  if (product.value.categoryEnabled == 0 && product.value.customInputEnabled == 1) {
    return product.value.customInput;
  } else if (product.value.categoryEnabled == 1 && category.value?.customInputEnabled == 1) {
    return category.value.customInput;
  }
  return '';
});

/**
 * 处理原始价格配置字符串，转换成 PriceConfig 数组。
 * @param value 原始配置字符串
 * @returns 转换后的价格配置数组
 */
const processPriceConfig = (value: string): PriceConfig[] => {
  return value.split('\n').map(item => {
    const [quantity, price] = item.split('=');
    return [parseInt(quantity, 10), parseFloat(price)];
  });
};

type PriceConfig = [number, number]; // [最小数量, 单价]

/**
 * 根据购买数量计算满减后的总价格。
 * @param quantity 购买数量
 * @param priceConfig 价格配置数组
 * @returns 满减后的总价格
 */
const calculateTotalPrice = (quantity: number, priceConfig: PriceConfig[]): number => {
  // 按最小数量降序排序
  priceConfig.sort((a, b) => b[0] - a[0]);

  // 检查是否达到最低批发数量
  if (priceConfig.length > 0 && quantity < priceConfig[priceConfig.length - 1][0]) {
    // 数量小于最低批发数量，使用原价
    return parseFloat((quantity * unitPrice.value).toFixed(2));
  }

  for (const [minQuantity, unitPrice] of priceConfig) {
    if (quantity >= minQuantity) {
      // 保留两位小数并转换回数字
      return parseFloat((quantity * unitPrice).toFixed(2));
    }
  }

  // 如果没有符合的折扣区间，使用原价
  return parseFloat((quantity * unitPrice.value).toFixed(2));
};

/**
 * 商品数量处理
 */
const onChangeNumber = (v: number) => {
  if (product.value.categoryEnabled == 1 && category.value?.wholesaleEnabled == 1) {
    // 如果商品启用了品类，并且选定的品类启用了批发
    const priceConfig = processPriceConfig(category.value?.wholesaleConfig as string);
    money.value = calculateTotalPrice(v, priceConfig);
  } else if (product.value.categoryEnabled == 0 && product.value.wholesaleEnabled == 1) {
    // 如果商品未启用品类，但启用了批发
    const priceConfig = processPriceConfig(product.value?.wholesaleConfig as string);
    money.value = calculateTotalPrice(v, priceConfig);
  } else {
    console.log("Unit Price:", unitPrice.value);
    money.value = parseFloat((unitPrice.value * v).toFixed(2));
    console.log("Total Money:", money.value);
  }
}

/**
 * 监听商品数量变化
 */
watch(() => form.number, (number) => {
  onChangeNumber(number as number);
})

/**
 * 初始自动计算商品价格
 */
onChangeNumber(product.value.categoryEnabled == 0 ? (product.value.minPurchaseQuantity as number) : (category.value?.minPurchaseQuantity as number));

/**
 * 提交按钮加载
 */
const submitLoading = ref<boolean>(false);

// 开始前先开启加载
const starLoading = () => {
  submitLoading.value = true;
}

const showSubmitDialog = ref<boolean>(false);
const paymentResult = ref<PaymentResult>({});

/**
 * 提交订单，并且支付
 */
const onSubmit = () => {
  submitLoading.value = true;
  if (!form.paymentType) {
    submitLoading.value = false;
    message.error('请选择支付方式！');
    return;
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      const hide = messageLoading('正在创建订单...', 0);
      createOrder(form).then((d) => {
        hide();
        submitLoading.value = false;
        switch (d.paymentType) {
          case 'balance':
            message.success('使用余额支付成功！');
            setTimeout(() => {
              navigateTo('/user/orders')
            }, 1500);
            break;
          default:
            message.success('订单创建完成、正在前往支付');
            setTimeout(() => {
              showSubmitDialog.value = true;
              paymentResult.value = d;
            }, 1500);
            break;
        }
      }).catch((error) => {
        hide();
        submitLoading.value = false;
        message.error(error.message)
      })
    } else {
      submitLoading.value = false;
    }
  })
}

/* 打开支付链接 */
const openUrl = (url: string) => {
  window.open(url, '_blank')
}

/**
 * SEO 设置
 */
useHead({
  title: computed(() => {
    if (product.value.productId && product.value.name) {
      return product.value.name
    } else {
      return '404'
    }
  }),
  titleTemplate: (title) => `${title} - 波猫杂货铺`,
  meta: [
    { name: 'Keywords', content: computed(() => {
        if (product.value.productId) {
          return product.value.classifyName;
        } else {
          return '404';
        }
      })},
    { name: 'description', content: computed(() => {
        if (product.value.productId) {
          return product.value.description ?? '致力于分享国内最全的账号销售平台'
        } else {
          return '404'
        }
      })
    }
  ],
})
</script>

<template>
  <div class="container">
    <div v-if="product && product.status === 1" style="margin: 15px 0; min-height: calc(100vh - 461px)">
      <n-breadcrumb>
        <n-breadcrumb-item><nuxt-link to="/">全部商品</nuxt-link></n-breadcrumb-item>
        <n-breadcrumb-item>{{ product.classifyName }}</n-breadcrumb-item>
        <n-breadcrumb-item>{{ product.name }}</n-breadcrumb-item>
      </n-breadcrumb>
      <div style="margin-top: 15px">
        <n-row gutter="15" style="display: block;">
          <n-col :span="16">
            <n-card
                :bordered="false"
                :segmented="{
                  content: true,
                  footer: 'soft'
                }"
                style="height: 100%"
                :header-style="{padding: '0px', fontSize: 'inherit'}"
                :content-style="{padding: '20px', minHeight: '410px'}"
            >
              <template #header>
                <div class="bomaos-product-box" style="margin: 20px; font-weight: normal;">
                  <n-row gutter="20">
                    <n-col :span="6">
                      <van-image
                          fit="cover"
                          width="132.08"
                          height="132.08"
                          :radius="5"
                          :src="defaultCover ?? product.coverImage"
                          style="background-color: rgba(0,0,0,0.05); display: block;"
                      >
                        <template v-slot:loading>
                          <van-loading type="spinner" size="40" />
                        </template>
                      </van-image>
                    </n-col>
                    <n-col :span="18">
                      <div style="min-height: 132.08px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div class="bomaos-product-title">
                          <p class="g-name">{{ product.name }}</p>
                          <p class="g-desc">
                            <n-ellipsis :line-clamp="2" :tooltip="false">
                              {{ product.description }}
                            </n-ellipsis>
                          </p>
                        </div>
                        <div class="van-cell__label" style="margin-top: 5px">
                          <n-space :size="0" style="align-items: center;">
                            <div class="action">
                              <n-tag
                                  size="small"
                                  :bordered="false"
                                  :type="product.categoryEnabled == 0 ? (product.shippingType === 0 ? 'info' : 'error') : (category?.shippingType === 0 ? 'info' : 'error')"
                              >
                                {{ product.categoryEnabled == 0 ? (product.shippingType === 0 ? '自动发货' : '人工发货') : (category?.shippingType === 0 ? '自动发货' : '人工发货') }}
                              </n-tag>
                            </div>
                            <n-divider vertical />
                            <div class="action">
                              <span>已出售: </span>
                              <span style="margin-left: 5px; color: var(--bomaos-color-primary)">
                                {{ product.categoryEnabled == 0 ? product.usedCount : category?.usedCount}}
                              </span>
                            </div>
                            <n-divider vertical />
                            <div class="action">
                              <span>库存: </span>
                              <span style="margin-left: 5px; color: var(--bomaos-color-primary)">
                                {{  product.categoryEnabled == 0 ? (product.unusedCount == 0 ? '库存不足' : product.unusedCount) : (category?.unusedCount == 0 ? '库存不足' : category?.unusedCount) }}
                              </span>
                            </div>
                          </n-space>
                        </div>
                      </div>
                    </n-col>
                  </n-row>
                </div>
                <n-divider style="margin: 20px 0 0 0"/>
                <div style="font-size: 18px; padding: 13px 20px 13px; background-color: #f5f5f561; display: flex; justify-content: space-between; align-items: center;">
                  <div>商品详情</div>
                  <span style="font-size: 15px; font-weight: 400; color: #666">请详细阅读商品详情</span>
                </div>
              </template>
              <common-view-md :content="product.details as string" />
            </n-card>
          </n-col>
          <n-col :span="8" class="sticky">
            <n-card
                title="批发价格"
                :bordered="false"
                :segmented="{
                  content: true,
                  footer: 'soft'
                }"
                :style="{ marginBottom: '15px' }"
                :header-style="{padding: '13px 20px'}"
                :content-style="{padding: '0px'}"
            >
              <template #header-extra>
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
                  <path d="M879.786667 421.077333l-24.746667-24.746666c-11.946667-11.946667-18.773333-28.16-18.773333-45.226667v-34.986667c0-70.826667-57.6-128.426667-128.426667-128.426666h-34.986667c-17.066667 0-33.28-6.4-45.226666-18.773334l-24.746667-24.746666a129.024 129.024 0 0 0-181.76 0l-24.746667 24.746666c-11.946667 12.373333-28.16 18.773333-45.226666 18.773334h-34.986667c-70.826667 0-128.426667 57.6-128.426667 128.426666v34.986667c0 17.066667-6.4 33.28-18.773333 45.226667l-24.746667 24.746666c-24.32 24.32-37.546667 56.746667-37.546666 90.88 0 34.133333 13.226667 66.56 37.546666 90.88l24.746667 24.746667c12.373333 11.946667 18.773333 28.16 18.773333 45.226667v34.986666c0 70.826667 57.6 128.426667 128.426667 128.426667h34.986667c17.066667 0 33.28 6.4 45.226666 18.773333l24.746667 24.746667c25.173333 25.173333 58.026667 37.546667 90.88 37.546667 32.853333 0 65.706667-12.373333 90.88-37.546667l24.746667-24.746667c11.946667-12.373333 28.16-18.773333 45.226666-18.773333h34.986667c70.826667 0 128.426667-57.6 128.426667-128.426667v-34.986666c0-17.066667 6.826667-33.28 18.773333-45.226667l24.746667-24.746667c24.32-24.32 37.546667-56.746667 37.546666-90.88 0-34.133333-13.226667-66.56-37.546666-90.88zM405.333333 351.957333a53.333333 53.333333 0 1 1 0 106.666667 53.333333 53.333333 0 0 1 0-106.666667z m213.333334 320a53.333333 53.333333 0 1 1 0-106.709333 53.333333 53.333333 0 0 1 0 106.666667z m51.626666-257.706666l-256 256c-8.533333 8.106667-19.2 12.373333-30.293333 12.373333-10.666667 0-21.76-4.266667-30.293333-12.373333-16.64-16.64-16.64-43.946667 0-60.586667l256-256c17.066667-16.64 43.946667-16.64 60.586666 0 16.64 16.64 16.64 43.946667 0 60.586667z" fill="#FFC130"></path>
                  <path d="M799.36 226.090667a128 128 0 0 1 36.906667 90.026666v34.986667c0 17.066667 6.826667 33.28 18.773333 45.226667l24.746667 24.746666c4.437333 4.437333 8.533333 9.173333 12.245333 14.165334L435.242667 891.989333a129.194667 129.194667 0 0 1-14.122667-12.245333l-24.746667-24.746667c-11.946667-12.373333-28.16-18.773333-45.226666-18.773333h-34.986667a128 128 0 0 1-90.026667-36.906667l128.426667-128.298666c8.405333 7.594667 19.114667 11.605333 29.44 11.605333 11.093333 0 21.76-4.266667 30.293333-12.373333l256-256c16.64-16.64 16.64-43.946667 0-60.586667l0.725334 0.810667z m-180.693333 339.2a53.333333 53.333333 0 1 0 0 106.666666 53.333333 53.333333 0 0 0 0-106.666666z" fill="#FFC745"></path>
                  <path d="M590.506667 133.290667c4.309333 3.328 8.448 6.954667 12.373333 10.88l24.746667 24.746666c11.946667 12.373333 28.16 18.773333 45.226666 18.773334h34.986667c35.84 0 68.266667 14.72 91.605333 38.485333l-128.426666 128.341333-0.725334-0.853333a42.922667 42.922667 0 0 0-56.490666-3.541333l-4.096 3.541333-256 256a43.008 43.008 0 0 0 0.853333 61.354667l-128.341333 128.384a128.042667 128.042667 0 0 1-38.485334-91.605334v-34.986666c0-17.066667-6.4-33.28-18.773333-45.226667l-24.746667-24.746667a129.408 129.408 0 0 1-10.88-12.373333zM405.333333 352a53.333333 53.333333 0 1 0 0 106.666667 53.333333 53.333333 0 0 0 0-106.666667z" fill="#FFCD59"></path>
                  <path d="M421.12 144.170667a129.152 129.152 0 0 1 169.386667-10.88L133.418667 590.506667a127.872 127.872 0 0 1-26.709334-78.549334c0-34.133333 13.226667-66.56 37.546667-90.88l24.746667-24.746666c12.373333-11.946667 18.773333-28.16 18.773333-45.226667v-34.986667c0-70.826667 57.6-128.426667 128.426667-128.426666h34.986666c17.066667 0 33.28-6.4 45.226667-18.773334z" fill="#FFD982"></path>
                </svg>
              </template>
              <!-- 已开启商品规格的批发价格 -->
              <div v-if="product.categoryEnabled === 1">
                <template v-if="category">
                  <!-- 未开启商品规格的批发价格 -->
                  <div v-if="category.wholesaleEnabled === 1" style="display: flex; flex-direction: column;">
                    <div class="nav-item" v-for="(item, index) in processPriceConfig(category.wholesaleConfig as string)" :key="index">
                      <div class="nav-cell__title">
                        <div :style="{ fontSize: '15px', fontWeight: 'normal', display: 'flex', alignItems: 'center'}">
                          <n-ellipsis :line-clamp="1" :tooltip="false">
                            购买{{ item[0] }}个以上
                          </n-ellipsis>
                        </div>
                        <n-tag :bordered="false" size="small" type="success">
                          每个{{ item[1] }}元
                        </n-tag>
                      </div>
                    </div>
                  </div>
                  <div v-else style="font-size: 15px; font-weight: normal; padding: 20px">
                    该品类暂无批发价格、详情请联系客服
                  </div>
                </template>
                <div v-else style="font-size: 15px; font-weight: normal; padding: 20px">
                  <div>请选择商品品类后显示批发价格</div>
                </div>
              </div>
              <!-- 未开启商品规格的批发价格 -->
              <div v-else-if="product.categoryEnabled === 0 && product.wholesaleEnabled === 1" style="display: flex; flex-direction: column;">
                <div class="nav-item" v-for="(item, index) in processPriceConfig(product.wholesaleConfig as string)" :key="index">
                  <div class="nav-cell__title">
                    <div :style="{ fontSize: '15px', fontWeight: 'normal', display: 'flex', alignItems: 'center'}">
                      <n-ellipsis :line-clamp="1" :tooltip="false">
                        购买{{ item[0] }}个以上
                      </n-ellipsis>
                    </div>
                    <n-tag :bordered="false" size="small" type="success">
                      每个{{ item[1] }}元
                    </n-tag>
                  </div>
                </div>
              </div>
              <!-- 都未开启商品规格 -->
              <div v-else style="font-size: 15px; font-weight: normal; padding: 20px">
                该商品暂无批发价格、详情请联系客服
              </div>
            </n-card>
            <n-card
                :bordered="false"
                :segmented="{
                  content: true,
                  footer: 'soft'
                }"
                :header-style="{padding: '0px'}"
                :content-style="{padding: '20px'}"
            >
              <n-form
                  ref="formRef"
                  :model="form"
                  :rules="rules"
                  size="large"
              >
                <n-form-item
                    v-if="product.categoryEnabled == 1"
                    label="选择品类"
                    path="categoryId"
                    :show-feedback="false"
                    style="margin-bottom: 15px"
                >
                  <n-select
                      v-model:value="form.categoryId"
                      placeholder="请选择品类"
                      :options="generalOptions"
                      :render-label="renderLabel"
                      @update:value="handleUpdateValue"
                  />
                </n-form-item>
                <template v-if="(product.categoryEnabled == 0 && product?.customInputEnabled == 1) || (product.categoryEnabled == 1 && category?.customInputEnabled == 1)">
                  <n-form-item
                      v-for="(item, index) in processedCustomData(dynamicInputSource)"
                      :key="index"
                      :label="`${item[1]}`"
                      :path="`dynamicFields.${item[0]}`"
                      :rule="{
                        required: item[2] == 'true',
                        message: `请输入${item[1]}`,
                        trigger: ['input', 'blur']
                      }"
                      :show-feedback="false"
                      style="margin-bottom: 15px"
                  >
                    <n-input v-model:value="form.dynamicFields![item[0]]" :placeholder="`请输入${item[1]}`" clearable/>
                  </n-form-item>
                </template>
                <n-form-item
                    v-if="product.wholesaleEnabled == 0"
                    label="折扣代码"
                    path="couponCode"
                    :show-feedback="false"
                    style="margin-bottom: 15px"
                >
                  <n-input v-model:value="form.couponCode" placeholder="请输入折扣代码" />
                </n-form-item>
                <n-form-item
                    label="商品数量"
                    path="number"
                    :show-feedback="false"
                    style="margin-bottom: 15px"
                >
                  <n-input-number
                      v-model:value="form.number"
                      placeholder="请输入商品数量"
                      :default-value="product.categoryEnabled == 0 ? (product.minPurchaseQuantity as number) : (category?.minPurchaseQuantity as number)"
                      :min="product.categoryEnabled == 0 ? (product.minPurchaseQuantity as number) : (category?.minPurchaseQuantity as number)"
                      :max="product.categoryEnabled == 0 ? ((product.maxPurchaseQuantity as number) === null ? product.unusedCount : (product.maxPurchaseQuantity as number)) : ((category?.maxPurchaseQuantity as number) === null ? category?.unusedCount : (category?.maxPurchaseQuantity as number))"
                      style="width: 100%"
                      @update:value="onChangeNumber"
                  />
                </n-form-item>
                <n-form-item label="支付方式" path="paymentType" :show-feedback="false">
                  <n-row :gutter="[10, 10]">
                    <n-col
                        :span="24"
                        v-for="payment in paymentList"
                        :key="payment.id"
                    >
                      <common-check-item
                          :checked="paymentActiveType == payment.id"
                          :on-toggle="() => onSwitchPayment(payment)"
                      >
                        <div
                            class="payment-btn"
                            style="display: flex; align-items: center; justify-content: center"
                        >
                          <n-image
                              width="20"
                              height="20"
                              object-fit="contain"
                              :src="getNameAndColor(payment?.driver as string).icon"
                              :preview-disabled="true"
                          />
                          <span style="margin-left: 8px; font-size: 17px">{{ payment.name }}</span>
                        </div>
                      </common-check-item>
                    </n-col>
                  </n-row>
                </n-form-item>
              </n-form>
              <template #action>
                <div class="footer-bar">
                  <div class="money">
                    <span class="small">¥</span>
                    <span style="font-size: 25px; font-weight: bold;">{{ money.toFixed(2) }}</span>
                  </div>
                  <n-button
                      icon-placement="left"
                      round
                      strong
                      secondary
                      type="primary"
                      size="large"
                      :loading="submitLoading"
                      @click="starLoading"
                      v-debounce="onSubmit"
                  >
                    <template #icon>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="-3 -4 24 24">
                        <path fill="currentColor" d="M7 16a2 2 0 1 1 0-4a2 2 0 0 1 0 4m7 0a2 2 0 1 1 0-4a2 2 0 0 1 0 4M.962 1.923A.962.962 0 0 1 .962 0h1.151c.902 0 1.682.626 1.878 1.506l1.253 5.642c.196.88.976 1.506 1.878 1.506h7.512l1.442-5.77H6.731a.962.962 0 0 1 0-1.922h9.345a1.923 1.923 0 0 1 1.866 2.39L16.5 9.12a1.923 1.923 0 0 1-1.866 1.457H7.122a3.846 3.846 0 0 1-3.755-3.012L2.113 1.923z"/>
                      </svg>
                    </template>
                    {{ token ? '提交订单' : '请先登陆' }}
                  </n-button>
                </div>
              </template>
            </n-card>
          </n-col>
        </n-row>
      </div>
      <desktop-product-submit-dialog
          v-model:visible="showSubmitDialog"
          :payment-result="paymentResult"
          :product="product"
          :category="category"
      />
    </div>
    <div v-else class="container" style=" margin: 15px">
      <n-card
          :bordered="false"
          :segmented="{
                  content: true,
                  footer: 'soft'
                }"
          style="height: 100%; min-height: calc(100vh - 431px);"
          :header-style="{padding: '0px', fontSize: 'inherit'}"
          :content-style="{padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}"
      >
        <div class="error">
          <n-result status="404" title="未找到商品" description="当前商品未上架呦 (๑•́ ₃ •̀๑)">
            <template #footer>
              <n-button @click="navigateTo('/')">回到首页</n-button>
            </template>
          </n-result>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.ant-card-head-title) {
  white-space: normal
}

.bomaos-product-title {
  .g-name {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
  }
  .g-desc {
    color: #999;
    margin-top: 10px;
  }
  .g-price {
    margin-top: 10px;
    span {
      &:before {
        content: "¥";
        font-size: 14px;
      }
      &:first-child {
        color: #cf4444;
        margin-right: 10px;
        font-size: 22px;
      }
      &:last-child {
        color: #999;
        text-decoration: line-through;
        font-size: 16px;
      }
    }
  }
}

.van-cell__label {
  margin-top: 0px;
  color: #707070;
  font-size: 12px;
  line-height: 18px;

  .action {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: var(--bomaos-color-dark);
  border-bottom: var(--bomaos-border-color);

  &:nth-last-child(1) {
    border-bottom: 0px solid transparent;
  }

  &:hover {
    background-color: #f5f5f561;
  }

  &.active {
    background-color: #f5f5f561;
    color: var(--bomaos-color-primary); /* 激活项的样式 */

    &:before {
      transition: top 0.3s ease-in-out;
      position: absolute;
      left: 1px;
      top: 50%;
      transform: translate(-50%, -50%);
      height: 50%;
      border-inline-start: 3px solid var(--bomaos-color-primary);
      border-radius: 999px;
      content: " ";
    }
  }

  &.disabled {
    pointer-events: none; /* 禁止点击 */
  }

  .cover {
    width: 25px;
    display: flex;
    align-items: center;
  }

  .nav-cell__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

:deep(.n-card__action) {
  padding: 15px 20px !important;
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .money {
      font-size: 15px;
      color: #d03050;
      line-height: 45px;
      font-weight: 600;

      .small {
        margin-right: 3px;
      }
    }
  }
}
</style>