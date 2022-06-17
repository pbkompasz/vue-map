import { App } from 'vue';
import Map from '@/components/Map.vue';

function install(Vue: App) {
	Vue.component(Map.name, Map);
}

export default { install };
export * from './components/Map';
export { default as Map } from '@/components/Map.vue';