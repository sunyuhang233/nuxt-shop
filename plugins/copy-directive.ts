import type {DirectiveBinding} from "vue";

/**
 * 自定义复制指令
 */
export default defineNuxtPlugin((nuxtApp) => {
    interface ElType extends HTMLElement {
        copyData: string | number;
        __handleClick__: any;
    }

    function handleClick(this: any) {
        navigator.clipboard.writeText(this.copyData.toLocaleString())
            .then(() => {
                console.log('复制成功', this.copyData);
                message.success('复制成功')
            })
            .catch(err => {
                console.error('复制失败', err);
                message.success('复制失败')
            });
    }

    nuxtApp.vueApp.directive('copy', {
        mounted (el: ElType, binding: DirectiveBinding) {
            el.copyData = binding.value;
            el.addEventListener('click', handleClick);
        },
        updated(el: ElType, binding: DirectiveBinding) {
            el.copyData = binding.value;
        },
        beforeUnmount(el: ElType) {
            el.removeEventListener('click', el.__handleClick__);
        },
        getSSRProps (binding, vnode) {
            // you can provide SSR-specific props here
            return {}
        }
    })
})