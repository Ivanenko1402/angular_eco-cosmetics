import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { goodsFromServer } from 'src/api/goods';
import { Product } from 'src/app/types/product';
import { ProductsToBuyService } from 'src/app/services/productsToBuy/products-to-buy.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent {
  product: Product;
  targetImg: string = '';
  bagList$: Observable<Product[]>;

  constructor(
    private route: ActivatedRoute,
    private productStore: ProductsToBuyService,
    ) {
    this.product = goodsFromServer.find(
      item => item.id === Number(this.route.snapshot.paramMap.get('id'))
    ) as Product;
    this.targetImg = this.product.image_link[0];
    this.bagList$ = productStore.getProducts().pipe(
      map(bagList => this.getCount(bagList)),
    );
  }

  addCart(product: Product) {
    this.productStore.addToList(product);
    this.bagList$ = this.productStore.getProducts().pipe(
      map(bagList => this.getCount(bagList)),
    );
  }
  getCount(bagList: Product[]): any {
    throw new Error('Method not implemented.');
  }

  includesProduct(product: Product) {
    return this.bagList$.toPromise().then(bagList => bagList?.some(p => p.id === product.id));
  }

  changeImg(str: string, num: number) {
    const index = this.product.image_link.indexOf(str);

    if (num > 0) {
      if (index === this.product.image_link.length - 1) {
        this.targetImg = this.product.image_link[0];
      } else {
        this.targetImg = this.product.image_link[index + 1];
      }
    } else {
      if (index === 0) {
        this.targetImg = this.product.image_link[this.product.image_link.length - 1];
      } else {
        this.targetImg = this.product.image_link[index - 1];
      }
    }
  }
}
