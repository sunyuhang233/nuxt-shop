import type {DirectiveBinding} from "vue";

export default defineNuxtPlugin((nuxtApp) => {

    interface ElType extends HTMLElement {
        __handleClick__: () => any;
    }

    nuxtApp.vueApp.directive('debounce', {
        mounted (el: ElType, binding: DirectiveBinding) {
            if (typeof binding.value !== 'function') {
                throw 'callback must be a function';
            }
            let timer: NodeJS.Timeout | null = null;
            el.__handleClick__ = function () {
                if (timer) {
                    clearInterval(timer);
                }
                timer = setTimeout(() => {
                    binding.value();
                }, 500);
            };
            el.addEventListener('click', el.__handleClick__);
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