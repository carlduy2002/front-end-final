import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/Account/login/login.component';
import { RegisterComponent } from './components/Account/register/register.component';
import { ViewProductComponent } from './components/management/products/view-product/view-product.component';
import { AddProductComponent } from './components/management/products/add-product/add-product.component';
import { UpdateProductComponent } from './components/management/products/update-product/update-product.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './components/Account/reset-password/reset-password.component';
import { AddCategoryComponent } from './components/management/categories/add-category/add-category.component';
import { UpdateCategoryComponent } from './components/management/categories/update-category/update-category.component';
import { ViewCategoryComponent } from './components/management/categories/view-category/view-category.component';
import { ViewSupplierComponent } from './components/management/suppliers/view-supplier/view-supplier.component';
import { AddSupplierComponent } from './components/management/suppliers/add-supplier/add-supplier.component';
import { UpdateSupplierComponent } from './components/management/suppliers/update-supplier/update-supplier.component';
import { ViewAccountComponent } from './components/management/accounts/view-account/view-account.component';
import { AddAccountComponent } from './components/management/accounts/add-account/add-account.component';
import { ViewOrderComponent } from './components/management/orders/view-order/view-order.component';
import { ViewOrderDetailComponent } from './components/management/orders/view-order-detail/view-order-detail.component';
import { ViewProductSearchComponent } from './components/view-product-search/view-product-search.component';
import { ViewProductCategoryComponent } from './components/view-product-category/view-product-category.component';
import { AdminComponent } from './components/admin/admin.component';
import { ProfileComponent } from './components/Account/profile/profile.component';
import { ChangePasswordComponent } from './components/Account/ChangePassword/change-password/change-password.component';
import { CheckOldPasswordComponent } from './components/Account/ChangePassword/check-old-password/check-old-password.component';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { OrderHistoryComponent } from './components/Account/order-history/order-history.component';
import { OrderHistoryDetailComponent } from './components/Account/order-history-detail/order-history-detail.component';
import { StatisticalComponent } from './components/statistical/statistical.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { ViewSizeComponent } from './components/management/size/view-size/view-size.component';
import { AddSizeComponent } from './components/management/size/add-size/add-size.component';
import { UpdateSizeComponent } from './components/management/size/update-size/update-size.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { AboutComponent } from './components/about/about.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TokenInterceptor } from './Interceptors/token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    ProductComponent,
    ProductDetailsComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    ViewProductComponent,
    AddProductComponent,
    UpdateProductComponent,
    ResetPasswordComponent,
    AddCategoryComponent,
    UpdateCategoryComponent,
    ViewCategoryComponent,
    ViewSupplierComponent,
    AddSupplierComponent,
    UpdateSupplierComponent,
    ViewAccountComponent,
    AddAccountComponent,
    ViewOrderComponent,
    ViewOrderDetailComponent,
    ViewProductSearchComponent,
    ViewProductCategoryComponent,
    AdminComponent,
    ProfileComponent,
    ChangePasswordComponent,
    CheckOldPasswordComponent,
    OrderHistoryComponent,
    OrderHistoryDetailComponent,
    StatisticalComponent,
    NavbarAdminComponent,
    BestSellerComponent,
    ViewSizeComponent,
    AddSizeComponent,
    UpdateSizeComponent,
    ConfirmComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      progressBar: true,
    }),
    CommonModule,
    SlickCarouselModule,
    NgxPayPalModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
