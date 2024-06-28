import { authGuard } from './Guards/auth.guard';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { NgbScrollSpyConfig } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/Account/login/login.component';
import { RegisterComponent } from './components/Account/register/register.component';
import { ViewProductComponent } from './components/management/products/view-product/view-product.component';
import { AddProductComponent } from './components/management/products/add-product/add-product.component';
import { UpdateProductComponent } from './components/management/products/update-product/update-product.component';
import { ResetPasswordComponent } from './components/Account/reset-password/reset-password.component';
import { UpdateCategoryComponent } from './components/management/categories/update-category/update-category.component';
import { AddCategoryComponent } from './components/management/categories/add-category/add-category.component';
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
import { CheckOldPasswordComponent } from './components/Account/ChangePassword/check-old-password/check-old-password.component';
import { ChangePasswordComponent } from './components/Account/ChangePassword/change-password/change-password.component';
import { OrderHistoryComponent } from './components/Account/order-history/order-history.component';
import { OrderHistoryDetailComponent } from './components/Account/order-history-detail/order-history-detail.component';
import { StatisticalComponent } from './components/statistical/statistical.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { BestSellerComponent } from './components/best-seller/best-seller.component';
import { customerGuard } from './Guards/customer.guard';
import { loginGuard } from './Guards/login.guard';
import { adminGuard } from './Guards/admin.guard';
import { ViewSizeComponent } from './components/management/size/view-size/view-size.component';
import { AddSizeComponent } from './components/management/size/add-size/add-size.component';
import { UpdateSizeComponent } from './components/management/size/update-size/update-size.component';
import { AboutComponent } from './components/about/about.component';
import { authorizeGuard } from './Guards/authorize.guard';


const routes: Routes = [
  {path:'', component: HomepageComponent},
  {path:'product', component: ProductComponent},
  {path:'product-details', component: ProductDetailsComponent},
  {path:'cart', component: CartComponent, canActivate: [customerGuard]},
  {path:'login', component: LoginComponent, canActivate: [loginGuard]},
  {path:'register', component: RegisterComponent},
  {path:'view-product', component: ViewProductComponent, canActivate: [authGuard]},
  {path:'add-product', component: AddProductComponent, canActivate: [authGuard]},
  {path:'update-product', component: UpdateProductComponent, canActivate: [authGuard]},
  {path: 'reset', component: ResetPasswordComponent},
  {path: 'view-category', component:ViewCategoryComponent, canActivate:[authGuard]},
  {path:'add-category', component: AddCategoryComponent, canActivate: [authGuard]},
  {path: 'update-category', component:UpdateCategoryComponent, canActivate: [authGuard]},
  {path: 'view-supplier', component:ViewSupplierComponent, canActivate: [adminGuard]},
  {path: 'add-supplier', component:AddSupplierComponent, canActivate: [adminGuard]},
  {path: 'update-supplier', component:UpdateSupplierComponent, canActivate: [adminGuard]},
  {path: 'view-account', component:ViewAccountComponent, canActivate: [authGuard]},
  {path: 'add-account', component:AddAccountComponent, canActivate: [authGuard]},
  {path: 'view-order', component:ViewOrderComponent, canActivate: [authGuard]},
  {path: 'view-order-detail', component:ViewOrderDetailComponent, canActivate: [authGuard]},
  {path: 'view-product-search/:key', component: ViewProductSearchComponent},
  {path: 'view-product-category/:categoryKey', component: ViewProductCategoryComponent},
  {path: 'admin', component: AdminComponent, canActivate: [adminGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [authorizeGuard]},
  {path: 'check-old-password', component: CheckOldPasswordComponent, canActivate: [authorizeGuard]},
  {path: 'change-password', component: ChangePasswordComponent, canActivate: [authorizeGuard]},
  {path: 'order-history', component: OrderHistoryComponent, canActivate: [customerGuard]},
  {path: 'order-history-detail', component: OrderHistoryDetailComponent, canActivate: [customerGuard]},
  {path: 'statistical', component: StatisticalComponent, canActivate: [authGuard]},
  {path: 'x', component: NavbarAdminComponent, canActivate: [authGuard]},
  {path: 'best-seller', component: BestSellerComponent, canActivate: [authGuard]},
  {path: 'view-size', component:ViewSizeComponent, canActivate: [adminGuard]},
  {path: 'add-size', component:AddSizeComponent, canActivate: [adminGuard]},
  {path: 'update-size', component:UpdateSizeComponent, canActivate: [adminGuard]},
  {path: 'about', component:AboutComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
