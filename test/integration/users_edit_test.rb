require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  
  def setup
    @user = users(:tomonori)
  end

  test "unsuccessful edit" do
    get edit_user_path(@user)
    assert_template 'users/edit'
    patch user_path(@user), user: { name: "",
                                    email: "invalid@dame",
                                    password: "bbbb",
                                    password_confirmation: "zzzz" }
    assert_template 'users/edit'
  end
end
