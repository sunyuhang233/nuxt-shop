import type { AgentPackage, AgentPackageParam } from './model';
import request from "~/composables/request";

/**
 * 查询套餐列表
 */
export async function listAgentPackages(params?: AgentPackageParam) {
  const res = await request.get<AgentPackage[]>('/marketing/agent-package', {...params}, {server: true});
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}

/**
 * 根据id查询套餐
 */
export async function getAgentPackage(agentId?: number) {
  const res = await request.get<AgentPackage>('/marketing/agent-package/getById/' + agentId, null, {server: true});
  if (res.code === 0 && res.data) {
    return res.data;
  }
  return Promise.reject(new Error(res.message));
}
