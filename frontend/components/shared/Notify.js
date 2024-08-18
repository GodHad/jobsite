import { Notify, Report, Confirm, Loading, Block } from "notiflix";

export function NotifyComponent(method, message){
    Notify.init({width:'280px',position:'right-bottom'})
    Notify[method](message)
}