import type { Shape } from "@mirohq/websdk-types";

let boardId: string = '';

const _setLinkTo = async (element: Shape, link: string | undefined = '') => {
    element.linkedTo = link;
    await element.sync();
}

export const setElementLink = async (element: Shape, miroElementId: string | undefined = '') => {
    if (!boardId) boardId = (await miro.board.getInfo()).id;
    const link = `https://miro.com/app/board/${boardId}/?moveToWidget=${miroElementId}`;
    return _setLinkTo(element, link);
}
export const unsetElementLink = async (element: Shape) => {
    return _setLinkTo(element, '');
}