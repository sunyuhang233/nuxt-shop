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
import {useSettingStore} from "~/store/useSettingStore";
import type {StoreSetting} from "~/api/settings/store-setting/model";

const setting = useSettingStore().setting as StoreSetting;
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
    showNotify({ type: 'primary', message: '请选择支付方式！' });
    return;
  }
  formRef.value?.validate((errors) => {
    if (!errors) {
      showLoadingToast({
        duration: 0,
        forbidClick: true,
        message: '正在创建订单...',
      });
      createOrder(form).then((d) => {
        closeToast();
        submitLoading.value = false;
        switch (d.paymentType) {
          case 'balance':
            showNotify({ type: 'success', message: '使用余额支付成功！' });
            setTimeout(() => {
              navigateTo('/user/orders')
            }, 1500);
            break;
          default:
            showNotify({ type: 'success', message: '订单创建完成、正在前往支付' });
            setTimeout(() => {
              showSubmitDialog.value = true;
              paymentResult.value = d;
            }, 1000);
            break;
        }
      }).catch((error) => {
        closeToast();
        submitLoading.value = false;
        showNotify({ type: 'warning', message: error.message });
      })
    } else {
      submitLoading.value = false;
    }
  })
}

/**
 * SEO 设置
 */
useHead({
  title: computed(() => {
    if (product.value.productId && product.value.name) {
      return product.value.name
    } else {
      return '404 - ' + setting.description
    }
  }),
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
          return product.value.description ?? setting.description
        } else {
          return '404'
        }
      })
    }
  ],
})
</script>

<template>
  <div>
    <div v-if="product && product.status === 1" class="container" style="min-height: calc(100vh - 431px); margin: 15px">
      <n-card
          :bordered="false"
          :segmented="{
                  content: true,
                  footer: 'soft'
                }"
          style="height: 100%"
          :header-style="{padding: '0px', fontSize: 'inherit'}"
          :content-style="{padding: '20px'}"
      >
        <template #header>
          <div class="bomaos-product-box" style="margin: 20px; font-weight: normal;">
            <a-row gutter="15">
              <a-col :span="7">
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <div class="square-wrapper">
                    <n-image
                        width="100%"
                        :src="defaultCover ?? product.coverImage"
                        object-fit="cover"
                        :preview-disabled="true"
                        style="border-radius: 5px; background-color: rgba(0, 0, 0, 0.05);"
                        class="square-image"
                    />
                  </div>
                </div>
              </a-col>
              <a-col :span="17">
                <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                  <div class="bomaos-product-title">
                    <p class="g-name">{{ product.name }}</p>
                    <p class="g-desc">
                      <n-ellipsis :line-clamp="2" :tooltip="false">
                        {{ product.description }}
                      </n-ellipsis>
                    </p>
                  </div>
                  <div class="van-cell__label">
                    <n-space :size="0" style="align-items: center;">
                      <n-tag
                          size="small"
                          :bordered="false"
                          :type="product.categoryEnabled == 0 ? (product.shippingType === 0 ? 'info' : 'error') : (category?.shippingType === 0 ? 'info' : 'error')"
                      >
                        {{ product.categoryEnabled == 0 ? (product.shippingType === 0 ? '自动发货' : '人工发货') : (category?.shippingType === 0 ? '自动发货' : '人工发货') }}
                      </n-tag>
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
                                {{ product.categoryEnabled == 0 ? (product.unusedCount == 0 ? '不足' : product.unusedCount) : (category?.unusedCount == 0 ? '不足' : category?.unusedCount) }}
                              </span>
                      </div>
                    </n-space>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </template>
        <n-alert :show-icon="false" style="margin-bottom: 20px">
          <!-- 已开启商品规格的批发价格 -->
          <div v-if="product.categoryEnabled === 1">
            <template v-if="category">
              <!-- 未开启商品规格的批发价格 -->
              <div v-if="category.wholesaleEnabled === 1">
                <template v-for="(item, index) in processPriceConfig(category.wholesaleConfig as string)" :key="index">
                  购买{{ item[0] }}个以上，每个{{ item[1] }}元。
                </template>
              </div>
              <div v-else style="font-size: 15px; font-weight: normal;">
                该品类暂无批发价格、详情请联系客服
              </div>
            </template>
            <div v-else style="font-size: 15px; font-weight: normal;">
              <div>请选择商品品类后显示批发价格</div>
            </div>
          </div>
          <!-- 未开启商品规格的批发价格 -->
          <div v-else-if="product.categoryEnabled === 0 && product.wholesaleEnabled === 1">
            <template v-for="(item, index) in processPriceConfig(product.wholesaleConfig as string)" :key="index">
              购买{{ item[0] }}个以上，每个{{ item[1] }}元。
            </template>
          </div>
          <!-- 都未开启商品规格 -->
          <div v-else style="font-size: 15px; font-weight: normal;">
            该商品暂无批发价格、详情请联系客服
          </div>
        </n-alert>
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
            >
              <n-input v-model:value="form.dynamicFields![item[0]]" :placeholder="`请输入${item[1]}`" clearable/>
            </n-form-item>
          </template>
          <n-form-item
              v-if="product.wholesaleEnabled == 0"
              label="折扣代码"
              path="couponCode"
          >
            <n-input v-model:value="form.couponCode" placeholder="请输入折扣代码" />
          </n-form-item>
          <n-form-item
              label="商品数量"
              path="number"
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
      <n-card
          :bordered="false"
          :segmented="{
                  content: true,
                  footer: 'soft'
                }"
          style="height: 100%; margin-top: 15px"
          :header-style="{padding: '0px', fontSize: 'inherit'}"
          :content-style="{padding: '20px', minHeight: '410px'}"
      >
        <template #header>
          <div style="font-size: 18px; padding: 13px 20px 13px; display: flex; justify-content: space-between; align-items: center;">
            <div>商品详情</div>
            <span style="font-size: 15px; font-weight: 400; color: #666">请详细阅读商品详情</span>
          </div>
        </template>
        <common-view-md :content="product.details as string" />
      </n-card>
      <mobile-product-submit-dialog
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
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
  }
  .g-desc {
    color: #999;
    margin-top: 5px;
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
    font-size: 13px;
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

.latest-activity-card__badge {
  position: absolute;
  right: -3.5px;
  top: -4px;
  height: 26px;
  background: linear-gradient(to right, rgb(255 59 59) 0%, rgba(255, 103, 128, 0.88) 100%);
  border-radius: 0 5px 0 5px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  z-index: 2;

  &:before {
    content: "";
    width: 14px;
    height: 26px;
    position: absolute;
    background-size: auto 100%;
    top: 0;
    left: -8px;
    background-image: url(https://cloudcache.tencent-cloud.cn/qcloud/ui/activity-v2/build/LatestActivity/images/badge-corner.svg);
  }
}

.square-wrapper {
  width: 100%;
  position: relative; /* 确保图片绝对定位的参照是这个容器 */
  overflow: hidden; /* 防止内容溢出 */
}

.square-wrapper::before {
  content: '';
  display: block;
  padding-top: 100%; /* 创建一个正方形的空间 */
}

.square-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%; /* 图片宽度填充整个容器 */
  height: 100%; /* 图片高度填充整个容器 */
  border-radius: 5px;
}
</style>