export interface IResponseWithLayout extends Response {
    locals: ILocalsLayout;
}

interface ILocalsLayout {
    layout: string;
}
