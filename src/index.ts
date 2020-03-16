import aw1 from '@mmstudio/aw000001';
import global from '@mmstudio/global';

export interface IFileDoc {
	id: string;
	contentType: string;
	name: string;
	md5: string;
}

/**
 * 文件上传
 * @param selector fileinput结点,可以是`#id`,或是`.class`等
 */
export default function upload(mm: aw1, selector: string, file_id: string) {
	const node = mm.data.node.querySelector<HTMLInputElement>(selector);
	if (!node) {
		throw new Error('Could not find node!');
	} else {
		return new Promise<IFileDoc>((resolve, reject) => {
			const form = document.createElement('form');
			const file_node = document.createElement('input');
			file_node.name = node.name;
			file_node.type = 'file';
			file_node.files = node.files;
			form.appendChild(file_node);
			const form_data = new FormData(form);
			const request = new XMLHttpRequest();
			request.onload = () => {
				if (request.status === 200) {
					const [file] = JSON.parse(request.responseText) as IFileDoc[];
					resolve(file);
				} else {
					reject(new Error(request.responseText));
				}
			};
			request.open('POST', `${global('host', '.')}/fsweb/reupload?id=${file_id}`);
			request.send(form_data);
		});
	}
}
