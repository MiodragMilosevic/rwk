class UserPolicy < ApplicationPolicy

  def update?
    user == record
  end

  def destroy?
    user == record
  end

  def show?
    user == record
  end

  def stripe?
    user == record
  end

  def change_password?
    user == record
  end
end
