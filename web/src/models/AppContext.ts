import React from 'react';

import { IAppModel } from "./AppModel";

export interface IAppContext {
    model: IAppModel;
}

export const AppContext = React.createContext<IAppContext | undefined>(undefined);
