import { Component, OnInit } from '@angular/core';
import {AbstractRolesComponentComponent} from "../abstract-roles-component/abstract-roles-component.component";
import {USERS_ROLES} from "../mock-users-roles";

@Component({
  selector: 'app-admin-tool',
  templateUrl: './admin-tool.component.html'
})
export class AdminToolComponent extends AbstractRolesComponentComponent implements OnInit {

  componentsList: string[];
  dataTable;
  userRoles;

  ngOnInit() {
    super.ngOnInit();
    this.init();
    this.userRoles = USERS_ROLES;
  }

  init() {
    this.componentsList = [];
    for (let key in this.rolesHelperService.componentsRoles) {
      this.componentsList.push(key);
    }

    this.dataTable = [];
    for (let role of this.rolesHelperService.rolesTree) {
      if (role.parent === '') {
        this.dataTable.push(this.addTableRow( role , 0));
        this.putAllChild(role.name, 1);
      }
    }
  }

  addTableRow( role, level) {
    let spacer = '';
    let result = [level, role.name];
    for (let comp of this.componentsList) {
      result.push(this.rolesHelperService.isComponentVisibleForRoles(comp, [role.name]));
    }
    return result;
  }

  putAllChild(parentRoleName, level) {
     for (let role of this.rolesHelperService.rolesTree) {
      if (role.parent === parentRoleName) {
        this.dataTable.push(this.addTableRow( role , level));
        this.putAllChild(role.name, level+1);
      }
    }
  }

  onCheckBoxClick(row, componentsList, index, checked) {
    let role = row[1];
    let component = componentsList[index-2];
    console.log(role, component, checked);
    let allChild = [role];
    for (let i = 0; i < allChild.length; i++) {
      for (let role of this.rolesHelperService.rolesTree) {
        if (allChild[i] === role.parent) allChild.push(role.name)
      }
    }
    let allParents = [role];
    for (let i = 0; i < allParents.length; i++) {
      for (let role of this.rolesHelperService.rolesTree) {
        if (allParents[i] === role.name) allParents.push(role.parent)
      }
    }

    console.log(role + ' ' + allChild.toString() + ' ' + allParents.toString())

    //снимаем роль, со всех детей, одеваем на всех родителей
    if (checked) {


      let componentRoles = this.rolesHelperService.componentsRoles[component];
      console.log(componentRoles.toString());
      let componetRolesResult = componentRoles;


      for (let role of allParents) {
        let isNeedToAdd = true;
        for (let roleFromCurrentList of componetRolesResult) {
          if (roleFromCurrentList === role) {
            isNeedToAdd = false;
          }
        }
        if (isNeedToAdd) {
          componetRolesResult.push(role);
        }
      }

      let componetRolesResultWithoutChild = [];
      for (let role of componetRolesResult) {
        let isNeedToRemove = false;
        for (let rolesToRemove of allChild) {
          if (role === rolesToRemove) {
            isNeedToRemove = true;
          }
        }

        if (!isNeedToRemove) componetRolesResultWithoutChild.push(role)
      }
      console.log(componetRolesResultWithoutChild.toString());




      this.rolesHelperService.componentsRoles[component] = componetRolesResultWithoutChild;

    }

    role = row[1];
    // когда ставим галочку, достаточно ее просто поставить :) остально само посчитается:)
    if (!checked) {
      console.log(role);
      this.rolesHelperService.componentsRoles[component].push(role);

    }

    this.init();
  }

  changeTheme() {
    let body = document.getElementsByTagName('body');
    if (body[0].className === '') {
      body[0].className = 'bdsm';
    } else {
      body[0].className = '';
    }
  }
}
