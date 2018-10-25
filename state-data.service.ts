import { Injectable } from '@angular/core';
// import { Db } from './db';
import { HttpClient, HttpParams } from '@angular/common/http';
declare var openDatabase: any;

@Injectable({
  providedIn: 'root'
})
export class StateDataService {
  private objStateCreated = false;

  public dataTest = [];

  constructor() {}

  stateSave(keyser, value, storageType) {
    if (storageType === 'local') {
      const state = JSON.parse(localStorage.getItem('statusState')); // ловлю состояние первого запуска
      this.objStateCreated = state;
      if (this.objStateCreated === null) {
        // first start (создаю объект) - первый запуск
        this.objStateCreated = true;
        localStorage.setItem(
          'statusState',
          JSON.stringify(this.objStateCreated)
        ); // сохраняю статус (чтоб не повторять первый запуск)
        const objState = {}; // создаю объект который будет хранить state
        localStorage.setItem('stateObject', JSON.stringify(objState)); // упаковываю объект с данными в локалсторадж
      }
      if (this.objStateCreated === true) {
        // second and others start (работаю с созданным объектом)
        const objectStates = JSON.parse(localStorage.getItem('stateObject')); // распарсил объект с данными
        objectStates[keyser] = value; // забил значение в него
        localStorage.setItem('stateObject', JSON.stringify(objectStates)); // снова упаковал
      }
    }
    if (storageType === 'db') {
      const db = openDatabase('ToDo', '0.1', 'A list of to do items.', 200000);

      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT COUNT(*) FROM ToDo',
          [],
          function(result) {},
          function(tx, error) {
            tx.executeSql(
              'CREATE TABLE ToDo (id INTEGER PRIMARY KEY ASC, label TEXT, keyname TEXT)',
              [],
              null,
              null
            );
          }
        );
      });

      db.transaction(function(tx) {
        tx.executeSql(
          'INSERT INTO ToDo (id, label) values(?, ?)',
          [keyser, value],
          null,
          null
        );
      });

      db.transaction(function(tx) {
        tx.executeSql(
          'SELECT * FROM ToDo',
          [],
          function(tx, result) {
            for (let i = 0; i < result.rows.length; i++) {
              // document.write('<b>' + result.rows.item(i)['label'] + '</b><br />');
            }
          },
          null
        );
      });

      // this.http.get('db.json').subscribe(data => { data[keyser] = value; console.log(data); } );   // на сервере???
    }
  }

  stateLoad(key, type) {
    if (type === 'local') {
      if (localStorage.length === 0) {
        // если локалсторадж пустая выхожу
        return;
      } else {
        const onLoadState = JSON.parse(localStorage.getItem('stateObject')); // распарсил объект
        const output = onLoadState[key]; // получил выходные значения по ключу
        return output;
      }
    }
    if (type === 'db') {
      // const db = openDatabase('ToDo', '0.1', 'A list of to do items.', 200000);
      // db.transaction(function(tx) {
      //   tx.executeSql('SELECT * FROM ToDo', [], function(tx, result) {
      //   console.log(result);
      // }, null);});
      //     const db = openDatabase('ToDo', '0.1', 'A list of to do items.', 200000);
      //     db.transaction(function(tx) {
      //         // tslint:disable-next-line:no-shadowed-variable
      //         tx.executeSql('SELECT * FROM ToDo', [], function(tx, result) {
      //           for (let i = 0; i < result.rows.length; i++) {
      //             if (result.rows.item(i).id === key) {
      //             const res = result.rows.item(i).label;
      //             }
      //           }
      //       });
      //    });
      // }
    }
  }

  deleteState() {
    localStorage.clear();

    const db = openDatabase('ToDo', '0.1', 'A list of to do items.', 200000);

    db.transaction(function(tx) {
      tx.executeSql('DELETE FROM ToDo');
    });
  }
}
