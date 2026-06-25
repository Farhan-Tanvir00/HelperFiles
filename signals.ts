import { Component, linkedSignal, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Auth } from './authentication/auth';
import { RouterOutlet } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { item } from '../interface/item-interface';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [Auth]
})
export class App {
  allItems = signal<item[]>([]);
  catagories = signal<string[]>([]);

  selectedCatagory = signal<string>('');
  searchQuery = signal<string>('');

  constructor(private httpClient: HttpClient){
    this.fetchItems();
  }

  fetchItems(){
    this.httpClient.get<{products: item[]}>('https://dummyjson.com/products')
    .subscribe({
      next: (res) =>{
        const items = res.products;
        this.allItems.set(items);

        const catagories: string[] = [
          ...new Set(items.map((item) => item.category))
        ];
        this.catagories.set(catagories);
      },
      error: (err) =>{
        console.log(err)
      }
    })
  }

  filteredItems = linkedSignal({
    source: () => ({
    items: this.allItems(),
    category: this.selectedCatagory(),
    search: this.searchQuery()
  }),
    computation: () => {
      const allItems = this.allItems();
      const catagory = this.selectedCatagory();
      const search = this.searchQuery()

      const FilteredItems = allItems.filter(
        (item) => (catagory === '' && item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        || 
       (item.category === catagory && item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())));

      return FilteredItems;
    }
  })

  updateCategory(event: Event){
    const category = (event.target as HTMLSelectElement).value
    this.selectedCatagory.set(category);
  }

  findProduct(event: Event){
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

}



// <div class="appcontainer">
//     <h2>Filter Items</h2>

//     <select name="" id="" (change)="updateCategory($event)">
//         <option value="" selected>All Catagories</option>
//         @for(catagory of catagories(); track $index){
//             <option [value]="catagory">{{catagory}}</option>
//         }
//     </select>
//     <input type="text" (input)="findProduct($event)">
// </div>

// <hr>
// <h2>Showing {{selectedCatagory() || "All"}} Items</h2>
// @for(item of filteredItems(); track $index){
//     <li>{{item.title}}</li>
// }