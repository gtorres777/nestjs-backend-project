// Project libraries
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Project files
import { BaseResponse } from 'src/helpers/BaseResponse';
import { CreateWalletDto } from './dtos/wallet.dto';
import { Wallet } from './interface/wallet.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private walletModel: Model<Wallet>
  ){}


  async addWallet(
    userWallet: CreateWalletDto,
    idUser: string,
  ): Promise<Wallet> {

    if(!idUser){

      throw new BadRequestException('Missing Id from user')

    } else if (!userWallet) {

      throw new BadRequestException('Missing user info to create wallet')

    } else {

      const wallet = new this.walletModel({ ...userWallet, _user: idUser });
      return await wallet.save();

    }
  }

  async getWallet(userId: string): Promise<Wallet> {

    if (!userId) {

      throw new BadRequestException('Missing Id from user')

    } else {

      const wallet = await this.walletModel.findOne({ _user: userId })

      if (!wallet){

        throw new NotFoundException('No wallet found for the given user')

      } else {

        return wallet

      }


    }
  }

  async addCoinsToWallet(
    idUser: string,
  ): Promise<BaseResponse> {

    if(!idUser){

      throw new BadRequestException('Missing Id from user')

    } else {

      const wallet = await this.walletModel.findOne({ _user: idUser });

      if (!wallet){

        throw new NotFoundException('No wallet found for the given user')

      } else {

        const default_coins_added = 3;

        wallet.total_coins += default_coins_added;

        await wallet.save();

        return {
          status: 201,
          message: "Monedas agregadas correctamente"
        }

      }

    }

  }


  async substractCoinsToWallet(
    idUser: string,
    coins: number
  ): Promise<BaseResponse> {

    if(!idUser){

      throw new BadRequestException('Missing Id from user')

    } else if (!coins) {

      throw new BadRequestException('Missing coins quantity')

    } else {

      const wallet = await this.walletModel.findOne({ _user: idUser });

      if (!wallet){

        throw new NotFoundException('No wallet found for the given user')

      } else {

        if (wallet.total_coins < coins) {

          return {
            status: 301,
            message: "No cuenta con las monedas suficientes"
          }

        } else {

          wallet.total_coins -= coins;
          await wallet.save();

          return {
            status: 201,
            message: "Monedas restadas correctamente"
          }

        }

      }

    }

  }

  async checkCoins(idUser: string, coins: number): Promise<boolean> {

    if(!idUser){

      throw new BadRequestException('Missing Id from user')

    } else if (!coins) {

      throw new BadRequestException('Missing coins quantity')

    } else {

      const wallet = await this.walletModel.findOne({ _user: idUser });

      if (!wallet){

        throw new NotFoundException('No wallet found for the given user')

      } else {

        if (wallet.total_coins < coins) return false
        else return true

      }

    }

  }
}
