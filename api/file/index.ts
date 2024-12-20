import type {FileRecord} from "@/api/file/model";
import request from "~/composables/request";

/**
 * 上传文件
 * @param file 文件
 */
export async function uploadFile(file?: any) {
    const formData = new FormData();
    formData.append('file', file.file);
    const res = await request.post<FileRecord>('/file/uploadEasy', formData, {
        server: false
    });
    if (res.code === 0 && res.data) {
        return res.data;
    }
    return Promise.reject(new Error(res.message));
}