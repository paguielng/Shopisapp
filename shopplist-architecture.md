# ShoppList Application Architecture

## Component Diagram

```mermaid
graph TD
    App[App] --> Auth[Auth Module]
    App --> Tabs[Tabs Module]
    App --> Lists[Lists Module]
    
    subgraph Auth[Auth Module]
        AuthLayout[AuthLayout]
        Login[Login]
        Register[Register]
    end
    
    subgraph Tabs[Tabs Module]
        TabsLayout[TabsLayout]
        Home[Home]
        ListsView[Lists]
        Add[Add]
        Budget[Budget]
        Profile[Profile]
    end
    
    subgraph Lists[Lists Module]
        ListsLayout[ListsLayout]
        ListsIndex[ListsIndex]
        NotFound[NotFound]
    end
    
    subgraph Components[Components]
        Header[Header]
        Screen[Screen]
        ShoppingListCard[ShoppingListCard]
        ShoppingListItem[ShoppingListItem]
        CategoryIcon[CategoryIcon]
        CategorySelector[CategorySelector]
        BudgetChart[BudgetChart]
    end
    
    Auth --> Components
    Tabs --> Components
    Lists --> Components
    
    Components --> Utils[Utils]
    Components --> Constants[Constants]
    
    Auth --> Hooks[Hooks]
    Tabs --> Hooks
    Lists --> Hooks
```

## Sequence Diagram (Authentication Flow)

```mermaid
sequenceDiagram
    actor User
    participant Login
    participant AuthService
    participant DataStorage
    
    User->>Login: Enter credentials
    Login->>AuthService: Authenticate(username, password)
    AuthService->>DataStorage: Validate credentials
    DataStorage-->>AuthService: Valid/Invalid response
    AuthService-->>Login: Authentication result
    alt is authenticated
        Login->>Tabs.Home: Redirect to Home
    else authentication failed
        Login-->>User: Show error message
    end
```

## Sequence Diagram (Shopping List Flow)

```mermaid
sequenceDiagram
    actor User
    participant Lists as Tabs.Lists
    participant Add as Tabs.Add
    participant Item as Components.ShoppingListItem
    participant Storage as DataStorage
    
    User->>Lists: View shopping lists
    Lists->>Storage: Fetch user lists
    Storage-->>Lists: Return lists data
    Lists->>Item: Render list previews
    
    User->>Add: Add new item
    Add->>Item: Select category
    User->>Add: Fill item details
    Add->>Storage: Save new item
    Storage-->>Lists: Update lists
    Lists->>Item: Render updated items
```

## State Diagram (Shopping List Item)

```mermaid
stateDiagram-v2
    [*] --> Pending: Create item
    Pending --> InCart: Add to cart
    Pending --> Deleted: Remove
    InCart --> Purchased: Mark as purchased
    InCart --> Pending: Remove from cart
    InCart --> Deleted: Remove
    Purchased --> [*]
    Deleted --> [*]
```

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ ShoppingList : owns
    ShoppingList ||--o{ ShoppingItem : contains
    ShoppingItem }|--|| Category : "belongs to"
    User ||--o{ Budget : tracks

    User {
        string id
        string username
        string email
        object profile
    }

    ShoppingList {
        string id
        string name
        string userId
        date createdAt
        boolean isActive
        number budget
    }

    ShoppingItem {
        string id
        string name
        string category
        number price
        boolean inCart
        boolean purchased
        string listId
    }

    Category {
        string id
        string name
        string icon
        string color
    }

    Budget {
        string id
        string userId
        number total
        number spent
        date month
    }
```

## Application Layers

```mermaid
graph TD
    A[Presentation Layer] --> B[Component Layer]
    B --> C[Business Logic Layer]
    C --> D[Data Access Layer]
    D --> E[External Services]
    
    subgraph "Presentation Layer"
        A1[App Screens]
        A2[Layouts]
    end
    
    subgraph "Component Layer"
        B1[UI Components]
        B2[Forms]
    end
    
    subgraph "Business Logic Layer"
        C1[Hooks]
        C2[Utilities]
    end
    
    subgraph "Data Access Layer"
        D1[API Clients]
        D2[Local Storage]
    end
    
    subgraph "External Services"
        E1[Authentication]
        E2[Database]
    end
```
