import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './interfaces/item.interface'

@Injectable()
export class AppService {

  constructor(@InjectModel('Item') private itemModel: Model<Item>) {}

  async getHello(): Promise<any> {

    const createdItem = new this.itemModel({
      title: `aea${Math.random()}`,
      price: 18,
      description: "aea1"
    })

    await createdItem.save()
    return await this.itemModel.find().exec();
  }



    // return /*html*/ `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>Document</title>
    //   <style>
    //     body {
    //       font-family: arial;
    //       background-color: #121212;
    //       color: #fff
    //     }

    //     h1  {
    //       color: #fff;
    //       font-size: 3.5rem
    //     }

    //     #app {
    //       width: 90%;
    //       margin: auto;
    //       text-align: center
    //     }

    //     button {
    //       background-color: #6E14EC;
    //       outline: none;
    //       border: none;
    //       padding: 10px 32px;
    //       border-radius: 7px;
    //       color: #fff;
    //       transition: opacity 0.8s;
    //       font-size: 25px
    //     }

    //     button:hover {
    //       opacity: 0.8;
    //       cursor: pointer
    //     }
    //   </style>
    // </head>
    // <body>
    //   <div id="app">
    //     <h1>{{count}}</h1>
    //     <button @click="aumentar">CLICK ME</button>
    //   </div>
    //   <script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
    //   <script>
    //     new Vue({
    //       el: "#app",
    //       data: {
    //         perra: "como tas manito aea",
    //         count: 0
    //       },
    //       methods: {
    //         aumentar() {
    //           console.log("aea")
    //           this.count = this.count + 1
    //         }
    //       }
    //     })
    //   </script>
    // </body>
    // </html>
    // `;
  //}
}
