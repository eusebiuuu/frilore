
export type ObjType = {
  id: string,
  body: unknown,
}

export function getStates(arrObj1: Array<ObjType>, arrObj2: Array<ObjType>) {
  const deletedObj: ObjType[] = arrObj1.filter(elem1 => {
    if (!arrObj2.find(elem2 => elem2.id === elem1.id)) {
      return elem1;
    }
  });
  const createdObj: ObjType[] = arrObj2.filter(elem2 => {
    if (!arrObj1.find(elem1 => elem1.id === elem2.id)) {
      return elem2;
    }
  });
  const updatedObj: ObjType[] = arrObj2.filter(elem2 => {
    const sameObj = arrObj1.find(elem1 => elem1.id === elem2.id ? elem1 : null);
    if (sameObj && JSON.stringify(elem2.body) !== JSON.stringify(sameObj.body)) {
      return true;
    }
  });
  return {
    create: createdObj.map((elem) => elem.body),
    update: updatedObj.map((elem) => elem.body),
    delete: deletedObj.map((elem) => elem.body),
  }
}